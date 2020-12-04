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
  FlowerStandResponse,
  FlowerStandResponseWithKeys,
  FlowerStandPreviewResponse,
  IFlowerStandGetRequestParams,
  IFlowerStandSearchRequestQuery,
  IFlowerStandVerifyAdminKeyRequestBody,
  IFlowerStandPreviewRequestBody,
  IFlowerStandAddRequestBody,
  IFlowerStandUpdateRequestParams,
  IFlowerStandUpdateRequestBody,
  IFlowerStandDeleteRequestParams,
  IFlowerStandDeleteRequestQuery } from '../interface/IFlowerStand';
import { IParticipant } from '../interface/IParticipant';
import { IGroup } from '../interface/IGroup';
import { FlowerStandImageGenerator, IPanelData } from '../lib/imageGenerator/FlowerStandImageGenerator';
import container from '../../inversify.config';
import Types from '../lib/Types';
import { SensitiveImageError } from '../lib/Errors';

@Controller('api/flowerstands')
export class FlowerStandController {
  @Get(':id')
  private async get(req: Request<IFlowerStandGetRequestParams, FlowerStandResponse, void, void>, res: Response<FlowerStandResponse>): Promise<Response<FlowerStandResponse>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.params.id, {relations: ['participants', 'event', 'event.groups', 'baseDesign', 'baseDesign.group']});
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const ret: FlowerStandResponse = this.toResponse(flowerStand);
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async search(req: Request<void, FlowerStandResponse[], void, IFlowerStandSearchRequestQuery>, res: Response<FlowerStandResponse[]>): Promise<Response<FlowerStandResponse[]>> {
    Logger.Info(req.query, true);

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const whereRaw: string[] = [];  // happy hackin'

      const isValidNumber = (x: unknown): boolean => {
        return Number.isInteger(Number(x)) && Number(x) >= 0;
      };

      if (req.query.baseDesignId && !isValidNumber(req.query.baseDesignId)) {
        Logger.Err(`invalid baseDesignId ${req.query.baseDesignId}`);
        return res.status(StatusCodes.BAD_REQUEST).json();
      } else if (req.query.baseDesignId) {
        whereRaw.push(`FlowerStand__baseDesign.id = ${req.query.baseDesignId}`);
      }

      if (req.query.eventId && !isValidNumber(req.query.eventId)) {
        Logger.Err(`invalid eventId ${req.query.eventId}`);
        return res.status(StatusCodes.BAD_REQUEST).json();
      } else if (req.query.eventId) {
        whereRaw.push(`FlowerStand__event.id = ${req.query.eventId}`);
      }

      if (req.query.groupId && !isValidNumber(req.query.groupId)) {
        Logger.Err(`invalid groupId ${req.query.groupId}`);
        return res.status(StatusCodes.BAD_REQUEST).json();
      } else if (req.query.groupId) {
        whereRaw.push(`FlowerStand__baseDesign__group.id = ${req.query.groupId}`);
      }

      if (req.query.offset && !isValidNumber(req.query.offset)) {
        Logger.Err(`invalid offset ${req.query.offset}`);
        return res.status(StatusCodes.BAD_REQUEST).json();
      }

      if (req.query.limit && !isValidNumber(req.query.limit)) {
        Logger.Err(`invalid limit ${req.query.limit}`);
        return res.status(StatusCodes.BAD_REQUEST).json();
      }

      if (req.query.offset && !req.query.limit) {
        Logger.Err('offset specified but limit not specified');
        return res.status(StatusCodes.BAD_REQUEST).json();
      }

      let flowerStands: FlowerStand[] = await repo.find({
        where: whereRaw.join(' and '),
        relations: ['participants', 'event', 'event.groups', 'baseDesign', 'baseDesign.group'],
        skip: req.query.offset ? req.query.offset : undefined,
        take: req.query.limit ? req.query.limit : undefined,
        order: {id: 'DESC'}});

      const ret: FlowerStandResponse[] = flowerStands.map((flowerStand: FlowerStand): FlowerStandResponse => {
        return this.toResponse(flowerStand);
      }, this);
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post('verify')
  private async verifyAdminKey(req: Request<void, void, IFlowerStandVerifyAdminKeyRequestBody, void>, res:Response<void>): Promise<Response<void>> {
    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.body.flowerStandId);
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (flowerStand.adminKey === req.body.adminKey) {
        return res.status(StatusCodes.OK).json();
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json();
      }
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post('preview')
  private async preview(req: Request<void, FlowerStandPreviewResponse, IFlowerStandPreviewRequestBody, void>, res: Response<FlowerStandPreviewResponse>): Promise<Response<FlowerStandPreviewResponse>> {
    try {
      const repo: Repository<BaseDesign> = getRepository(BaseDesign);
      const baseDesign = await repo.findOne(req.body.baseDesignId);
      if (!baseDesign) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const eventRepo: Repository<Event> = getRepository(Event);
      const event: Event | undefined = await eventRepo.findOne(req.body.eventId);
      if (!event) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      let panel: IPanelData | null = null;
      if (req.body.panel) {
        const encodedData = req.body.panel;
        const filedata = encodedData.replace(/^data:\w+\/\w+;base64,/, '');
        const decodedData = Buffer.from(filedata, 'base64');
        panel = {
          data: decodedData,
          ext: req.body.panel.slice(req.body.panel.indexOf('/') + 1, req.body.panel.indexOf(';')),
          contentType: req.body.panel.slice(req.body.panel.indexOf(':') + 1, req.body.panel.indexOf(';'))
        }
      }

      try {
        const generator: FlowerStandImageGenerator = container.get<FlowerStandImageGenerator>(Types.FlowerStandImageGenerator);
        const imageUrl: string = await generator.generateFlowerStandImage(baseDesign.imageUrl, req.body.prefix, req.body.presentTo, req.body.presentFrom, event.name, panel, true);

        return res.status(StatusCodes.OK).json({imageUrl: imageUrl, isError: 0});
      } catch (err: any) {
        if (err instanceof SensitiveImageError) {
          Logger.Err('sensitive image detected');
          return res.status(StatusCodes.BAD_REQUEST).json({errorType: 'SENSITIVE_IMAGE', isError: 1});
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post()
  private async add(req: Request<void, FlowerStandResponseWithKeys, IFlowerStandAddRequestBody, void>, res: Response<FlowerStandResponseWithKeys>): Promise<Response<FlowerStandResponseWithKeys>> {
    try {
      let remoteIp: string = '';
      if (req.headers['X-Real-IP'] && typeof req.headers['X-Real-IP'] === 'string') {
        remoteIp = req.headers['X-Real-IP'];
      } else if (req.headers['X-Forwarded-For'] && typeof req.headers['X-Forwarded-For'] === 'string') {
        remoteIp = req.headers['X-Forwarded-For'];
      } else if (req.headers['X-Forwarded-For'] && Array.isArray(req.headers['X-Forwarded-For'])) {
        remoteIp = req.headers['X-Forwarded-For'][0];
      } else if (req.connection.remoteAddress) {
        remoteIp = req.connection.remoteAddress;
      } else {
        Logger.Warn('remote ip address unknown');
        remoteIp = 'UNKNOWN';
      }
      remoteIp = remoteIp.replace(/^.*:/, '');

      const designRepo: Repository<BaseDesign> = getRepository(BaseDesign);
      const baseDesign: BaseDesign | undefined = await designRepo.findOne(req.body.baseDesignId, {relations: ['group']});
      if (!baseDesign) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const eventRepo: Repository<Event> = getRepository(Event);
      const event: Event | undefined = await eventRepo.findOne(req.body.eventId);
      if (!event) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      let panel: IPanelData | null = null;
      if (req.body.panel) {
        const encodedData = req.body.panel;
        const filedata = encodedData.replace(/^data:\w+\/\w+;base64,/, '');
        const decodedData = Buffer.from(filedata, 'base64');
        panel = {
          data: decodedData,
          ext: req.body.panel.slice(req.body.panel.indexOf('/') + 1, req.body.panel.indexOf(';')),
          contentType: req.body.panel.slice(req.body.panel.indexOf(':') + 1, req.body.panel.indexOf(';'))
        }
      }

      const generator: FlowerStandImageGenerator = container.get<FlowerStandImageGenerator>(Types.FlowerStandImageGenerator);
      let imageUrl: string = '';
      try {
        imageUrl = await generator.generateFlowerStandImage(baseDesign.imageUrl, req.body.prefix, req.body.presentTo, req.body.presentFrom, event.name, panel, false);
      } catch (err: any) {
        if (err instanceof SensitiveImageError) {
          Logger.Err('sensitive image detected');
          return res.status(StatusCodes.BAD_REQUEST).json({errorType: 'SENSITIVE_IMAGE', isError: 1});
        } else {
          throw err;
        }
      }
    
      const fsRepo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand = new FlowerStand(req.body.name, req.body.presentTo, req.body.presentFrom, event, req.body.organizerName, remoteIp, this.generateAdminKey(), this.generateParticipationCode(), baseDesign, imageUrl);
      flowerStand.description = req.body.description;
      flowerStand.projectUrl = req.body.projectUrl;
      const newStand: FlowerStand = await fsRepo.save(flowerStand);
      if (!newStand.id) {
        Logger.Err('flower stand id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }
      try {
        const ret: FlowerStandResponseWithKeys = this.toResponseWithKeys(newStand);
        return res.status(StatusCodes.OK).json(ret);
      } catch (err) {
        Logger.Err(err);
        await fsRepo.remove(newStand);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }
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

  private toResponse(flowerStand: FlowerStand): FlowerStandResponse {
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
      imageUrl: flowerStand.imageUrl,
      isError: 0
    };
  }

  private toResponseWithKeys(flowerStand: FlowerStand): FlowerStandResponseWithKeys {
    const base: FlowerStandResponse = this.toResponse(flowerStand);
    if (base.isError === 0) {
      return {adminKey: flowerStand.adminKey, participationCode: flowerStand.participationCode, ...base};
    } else {
      return {isError: 1, errorType: 'unknown, should not reach here'};
    }
  }
}
