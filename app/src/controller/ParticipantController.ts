import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Repository, getRepository } from 'typeorm';
import { FlowerStand } from '../entity/FlowerStand';
import { Participant } from '../entity/Participant';
import {
  IParticipant,
  IParticipantGetRequestParams,
  IParticipantGetAllRequestQuery,
  IParticipantAddRequestBody,
  IParticipantDeleteRequestParams,
  IParticipantDeleteRequestQuery } from '../interface/IParticipant';

@Controller('api/participants')
export class ParticipantController {
  @Get(':id')
  private async get(req: Request<IParticipantGetRequestParams, IParticipant, void, void>, res: Response<IParticipant>): Promise<Response<IParticipant>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<Participant> = getRepository(Participant);
      const participant: Participant | undefined = await repo.findOne(req.params.id);
      if (!participant) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (!participant.id) {
        Logger.Err('participant id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      const ret: IParticipant = {
        id: participant.id,
        name: participant.name,
        twitterId: participant.twitterId,
        instagramId: participant.instagramId,
        facebookId: participant.facebookId,
        mastodonId: participant.mastodonId
      };
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async getAll(req: Request<void, IParticipant[], void, IParticipantGetAllRequestQuery>, res: Response<IParticipant[]>): Promise<Response<IParticipant[]>> {
    Logger.Info(req.query, true);

    if (!req.query.flowerStandId) {
      Logger.Info('ParticipantController#getAll called but no flower stand specified');
      return res.status(StatusCodes.BAD_REQUEST).json();
    }

    try {
      const repo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await repo.findOne(req.query.flowerStandId, {relations: ['participants']});
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      const participants: Participant[] | undefined = flowerStand.participants;
      if (!participants) {
        Logger.Err(`participants of flowerstand ${flowerStand.id} undefined`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      const ret: IParticipant[] = participants.map((participant: Participant): IParticipant => {
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
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Post()
  private async add(req: Request<void, void, IParticipantAddRequestBody, void>, res: Response<void>): Promise<Response<void>> {
    Logger.Info(req.body, true);

    try {
      const fsRepo: Repository<FlowerStand> = getRepository(FlowerStand);
      const flowerStand: FlowerStand | undefined = await fsRepo.findOne(req.body.flowerStandId);
      if (!flowerStand) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (flowerStand.participationCode !== req.body.participationCode) {
        return res.status(StatusCodes.UNAUTHORIZED).json();
      }

      if (flowerStand.participants && flowerStand.participants.length >= 100) {
        return res.status(StatusCodes.FORBIDDEN).json();
      }

      const participant = new Participant(req.body.name, flowerStand);
      if (req.body.twitterId) {
        participant.twitterId = req.body.twitterId;
      }

      if (req.body.instagramId) {
        participant.instagramId = req.body.instagramId;
      }

      if (req.body.facebookId) {
        participant.facebookId = req.body.facebookId;
      }

      if (req.body.mastodonId) {
        participant.mastodonId = req.body.mastodonId;
      }

      const repo: Repository<Participant> = getRepository(Participant);
      await repo.save(participant);
      return res.status(StatusCodes.OK).json();
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Delete(':id')
  private async delete(req: Request<IParticipantDeleteRequestParams, void, void, IParticipantDeleteRequestQuery>, res: Response<void>): Promise<Response<void>> {
    Logger.Info(req.params, true);
    Logger.Info(req.query, true);

    try {
      const repo: Repository<Participant> = getRepository(Participant);
      const participant: Participant | undefined = await repo.findOne(req.params.id, {relations: ['flowerStand']});
      if (!participant) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (participant.flowerStand.adminKey !== req.query.adminKey) {
        return res.status(StatusCodes.UNAUTHORIZED).json();
      }

      await repo.delete(req.params.id);
      return res.status(StatusCodes.OK).json();
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }
}
