import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Repository, getRepository } from 'typeorm';
import { Group } from '../entity/Group';
import { IGroup, IGroupGetRequestParams } from '../interface/IGroup';

@Controller('api/groups')
export class GroupController {
  @Get(':id')
  private async get(req: Request<IGroupGetRequestParams, IGroup, void, void>, res: Response<IGroup>): Promise<Response<IGroup>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<Group> = getRepository(Group);
      const group: Group | undefined = await repo.findOne(req.params.id);
      if (!group) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }
      if (!group.id) {
        Logger.Err('group id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }
      const ret: IGroup = {
        id: group.id,
        name: group.name
      };
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async getAll(req: Request<void, IGroup[], void, void>, res: Response<IGroup[]>): Promise<Response<IGroup[]>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<Group> = getRepository(Group);
      const groups: Group[] = await repo.find();
      const ret:IGroup[] = groups.map((group: Group): IGroup => {
        if (!group.id) {
          throw 'group id not defined, should not reach here';
        }
        return {
          id: group.id,
          name: group.name
        };
      });
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }
}
