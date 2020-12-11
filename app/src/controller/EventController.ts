import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Repository, getRepository } from 'typeorm';
import { Event } from '../entity/Event';
import { IEvent, IEventGetRequestParams } from '../interface/IEvent';
import { Group } from '../entity/Group';
import { IGroup } from '../interface/IGroup';

@Controller('api/events')
export class EventController {
  @Get(':id')
  private async get(req: Request<IEventGetRequestParams, IEvent, void, void>, res: Response<IEvent>): Promise<Response<IEvent>> {
    try {
      const repo: Repository<Event> = getRepository(Event);
      const event: Event | undefined = await repo.findOne(req.params.id, {relations: ['groups']});
      if (!event) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (!event.id) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      const groups: IGroup[] | undefined = event.groups?.map((group: Group): IGroup => {
        if (!group.id) {
          throw 'group id not defined, should not reach here';
        }
        return {
          id: group.id,
          name: group.name
        };
      });

      const ret: IEvent = {
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        groups: groups ? groups : []
      };
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async getAll(req: Request<void, IEvent[], void, void>, res: Response<IEvent[]>): Promise<Response<IEvent[]>> {
    try {
      const repo: Repository<Event> = getRepository(Event);
      const events: Event[] = await repo.find({relations: ['groups']});
      const ret: IEvent[] = events.map((event: Event): IEvent => {
        if (!event.id) {
          throw 'event id not defined, should not reach here';
        }
        const groups: IGroup[] | undefined = event.groups?.map((group: Group): IGroup => {
          if (!group.id) {
            throw 'group id not defined, should not reach here';
          }
          return {
            id: group.id,
            name: group.name
          };
        });
        return {
          id: event.id,
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          groups: groups ? groups : []
        }
      });
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }
}
