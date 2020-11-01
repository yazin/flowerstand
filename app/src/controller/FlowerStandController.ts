import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Repository, getRepository } from 'typeorm';
import { FlowerStand } from '../entity/FlowerStand';
import { BaseDesign } from '../entity/BaseDesign';
import { Event } from '../entity/Event';
import { Group } from '../entity/Group';
import { Participant } from '../entity/Participant';
import { 
  IFlowerStand,
  IFlowerStandWithKeys,
  IFlowerStandPreview,
  IFlowerStandGetRequestParams,
  IFlowerStandSearchRequestQuery,
  IFlowerStandPreviewRequestBody,
  IFlowerStandAddRequestBody,
  IFlowerStandUpdateRequestParams,
  IFlowerStandUpdateRequestBody,
  IFlowerStandDeleteRequestParams,
  IFlowerStandDeleteRequestQuery } from '../interface/IFlowerStand';
import { IParticipant } from '../interface/IParticipant';
import { IGroup } from '../interface/IGroup';

@Controller('api/flowerstands')
export class FlowerStandController {
  @Get(':id')
  private async get(req: Request<IFlowerStandGetRequestParams, IFlowerStand, void, void>, res: Response<IFlowerStand>): Promise<Response<IFlowerStand>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.params.id, {relations: ['participants', 'event', 'event.groups', 'baseDesign', 'baseDesign.group']});
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const ret: IFlowerStand = this.toInterface(flowerStand);
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async search(req: Request<void, IFlowerStand[], void, IFlowerStandSearchRequestQuery>, res: Response<IFlowerStand[]>): Promise<Response<IFlowerStand[]>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      let where = {};
      if (req.query.baseDesignId && req.query.eventId) {
        where = {baseDesignId: req.query.baseDesignId, eventId: req.query.eventId};
      } else if (req.query.baseDesignId) {
        where = {baseDesignId: req.query.baseDesignId};
      } else if (req.query.eventId) {
        where = {eventId: req.query.eventId};
      }
      const flowerStands: FlowerStand[] = await repo.find({where: where, relations: ['participants', 'event', 'event.groups', 'baseDesign', 'baseDesign.group']});
      const ret: IFlowerStand[] = flowerStands.map((flowerStand: FlowerStand): IFlowerStand => {
        return this.toInterface(flowerStand);
      }, this);
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post('preview')
  private async preview(req: Request<void, IFlowerStandPreview, IFlowerStandPreviewRequestBody, void>, res: Response<IFlowerStandPreview>): Promise<Response<IFlowerStandPreview>> {
    //Logger.Info(req.body, true);

    try {
      if (req.body.panel) {
        const panel: Buffer = Buffer.from(req.body.panel.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
        const ext: string = req.body.panel.slice(req.body.panel.indexOf('/') + 1, req.body.panel.indexOf(';'));
        const contentType: string = req.body.panel.slice(req.body.panel.indexOf(':') + 1, req.body.panel.indexOf(';'));
  
        Logger.Info(ext);
        Logger.Info(contentType);
      }

      const repo: Repository<BaseDesign> = getRepository(BaseDesign);
      const baseDesign = await repo.findOne(req.body.baseDesignId);
      if (!baseDesign) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      // TODO: generate preview image

      // FIXME: mock
      return res.status(StatusCodes.OK).json({imageUrl: baseDesign.imageUrl});
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post()
  private async add(req: Request<void, IFlowerStandWithKeys, IFlowerStandAddRequestBody, void>, res: Response<IFlowerStandWithKeys>): Promise<Response<IFlowerStandWithKeys>> {
    Logger.Info(req.body, true);

    try {
      let remoteIp: string = '';
      if (typeof req.headers['x-forwarded-for'] === 'string') {
        remoteIp = req.headers['x-forwarded-for'];
      } else if (req.connection.remoteAddress) {
        remoteIp = req.connection.remoteAddress;
      } else {
        Logger.Warn('remote ip address unknown');
        remoteIp = 'UNKNOWN';
      }
      remoteIp = remoteIp.replace(/^.*:/, '');

      const designRepo: Repository<BaseDesign> = getRepository(BaseDesign);
      const baseDesign: BaseDesign | undefined = await designRepo.findOne(req.body.baseDesignId);
      if (!baseDesign) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const eventRepo: Repository<Event> = getRepository(Event);
      const event: Event | undefined = await eventRepo.findOne(req.body.eventId);
      if (!event) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (req.body.panel) {
        const panel: Buffer = Buffer.from(req.body.panel.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
        const ext: string = req.body.panel.slice(req.body.panel.indexOf('/') + 1, req.body.panel.indexOf(';'));
        const contentType: string = req.body.panel.slice(req.body.panel.indexOf(':') + 1, req.body.panel.indexOf(';'));
      }

      // TODO: generate image
      const imageUrl: string = baseDesign.imageUrl;

      const fsRepo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand = new FlowerStand(req.body.name, req.body.presentTo, req.body.presentFrom, event, req.body.organizerName, remoteIp, this.generateAdminKey(), this.generateParticipationCode(), baseDesign, imageUrl);
      flowerStand.description = req.body.description;
      flowerStand.projectUrl = req.body.projectUrl;
      const newStand: FlowerStand = await fsRepo.save(flowerStand);
      if (!newStand.id) {
        Logger.Err('flower stand id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      const ret: IFlowerStandWithKeys = this.toInterfaceWithKeys(newStand);
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Put(':id')
  private async update(req: Request<IFlowerStandUpdateRequestParams, void, IFlowerStandUpdateRequestBody, void>, res: Response<void>): Promise<Response<void>> {
    Logger.Info(req.params, true);
    Logger.Info(req.body, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.params.id);
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (flowerStand.adminKey !== req.body.adminKey) {
        return res.status(StatusCodes.UNAUTHORIZED).json();
      }

      if (req.body.name) {
        flowerStand.name = req.body.name;
      }

      if (req.body.presentTo) {
        flowerStand.presentTo = req.body.presentTo;
      }

      if (req.body.presentFrom) {
        flowerStand.presentFrom = req.body.presentFrom;
      }

      if (req.body.organizerName) {
        flowerStand.organizerName = req.body.organizerName;
      }

      if (req.body.description) {
        flowerStand.description = req.body.description;
      }

      if (req.body.projectUrl) {
        flowerStand.projectUrl = req.body.projectUrl;
      }

      await repo.save(flowerStand);
      return res.status(StatusCodes.OK).json();
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Delete(':id')
  private async delete(req: Request<IFlowerStandDeleteRequestParams, void, void, IFlowerStandDeleteRequestQuery>, res: Response<void>): Promise<Response<void>> {
    Logger.Info(req.params, true);
    Logger.Info(req.query, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.params.id, {relations: ['participants']});
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (flowerStand.adminKey !== req.query.adminKey) {
        return res.status(StatusCodes.UNAUTHORIZED).json();
      }

      const participants: Participant[] | undefined = flowerStand.participants;
      if (participants) {
        const prepo: Repository<Participant> = getRepository(Participant);
        await prepo.remove(participants);
      }

      await repo.delete(req.params.id);
      return res.status(StatusCodes.OK).json();
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  private generateAdminKey(): string {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    const numbers: string = '0123456789';
    const symbols: string = '!#$%_+-^.=~/';
    const allowedChars: string = letters + letters.toUpperCase() + numbers + symbols;

    let key: string = '';
    for (let i = 0; i < 8; i++) {
      key += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }

    return key;
  }

  private generateParticipationCode(): string {
    const letters: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers: string = '23456789';
    const allowedChars: string = letters + numbers;

    let codes: string[] = [];
    for (let i = 0; i < 4; i++) {
      let part: string = '';
      for (let j = 0; j < 4; j++) {
        part += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
      }
      codes.push(part);
    }

    return codes.join('-');
  }

  private toInterface(flowerStand: FlowerStand): IFlowerStand {
    if (!flowerStand.id) {
      throw 'flower stand id not defined, should not reach here';
    }

    if (!flowerStand.event.id) {
      throw 'event id not defined, should not reach here';
    }

    if (!flowerStand.baseDesign.id) {
      throw 'base design id not defined, should not reach here';
    }

    if (!flowerStand.baseDesign.group.id) {
      throw 'group id not defined, should not reach here';
    }

    const participants: IParticipant[] | undefined = flowerStand.participants?.map((participant: Participant): IParticipant => {
      if (!participant.id) {
        throw 'participant id not defined, should not reach here';
      }
      return {
        id: participant.id,
        name: participant.name,
        twitterId: participant.twitterId,
        instagramId: participant.instagramId,
        facebookId: participant.facebookId,
        mastodonId: participant.mastodonId
      };
    });

    const groups: IGroup[] | undefined = flowerStand.event.groups?.map((group: Group): IGroup => {
      if (!group.id) {
        throw 'group id not defined, should not reach here';
      }
      return {
        id: group.id,
        name: group.name
      };
    });

    return {
      id: flowerStand.id,
      name: flowerStand.name,
      presentTo: flowerStand.presentTo,
      presentFrom: flowerStand.presentFrom,
      event: {
        id: flowerStand.event.id,
        name: flowerStand.event.name,
        startDate: flowerStand.event.startDate,
        endDate: flowerStand.event.endDate,
        groups: groups ? groups : []
      },
      description: flowerStand.description,
      projectUrl: flowerStand.projectUrl,
      organizerName: flowerStand.organizerName,
      participants: participants ? participants : [],
      baseDesign: {
        id: flowerStand.baseDesign.id,
        name: flowerStand.baseDesign.name,
        imageUrl: flowerStand.baseDesign.imageUrl,
        sortOrder: flowerStand.baseDesign.sortOrder,
        group: {
          id: flowerStand.baseDesign.group.id,
          name: flowerStand.baseDesign.group.name
        }
      },
      imageUrl: flowerStand.imageUrl
    };
  }

  private toInterfaceWithKeys(flowerStand: FlowerStand): IFlowerStandWithKeys {
    const base: IFlowerStand = this.toInterface(flowerStand);
    return {adminKey: flowerStand.adminKey, participationCode: flowerStand.participationCode, ...base}
  }
}
