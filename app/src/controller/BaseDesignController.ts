import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Repository, getRepository } from 'typeorm';
import { BaseDesign } from '../entity/BaseDesign';
import { IBaseDesign, IBaseDesignGetRequestParams } from '../interface/IBaseDesign';

@Controller('api/basedesigns')
export class BaseDesignController {
  @Get(':id')
  private async get(req: Request<IBaseDesignGetRequestParams, IBaseDesign, void, void>, res: Response<IBaseDesign>): Promise<Response<IBaseDesign>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<BaseDesign> = getRepository(BaseDesign);
      const design: BaseDesign | undefined = await repo.findOne(req.params.id, {relations: ['group']});
      if (!design) {
        return res.status(StatusCodes.NO_CONTENT).json();
      }

      if (!design.id) {
        Logger.Err('base design id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      if (!design.group.id) {
        Logger.Err('group id not defined, should not reach here');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
      }

      const ret: IBaseDesign = {
        id: design.id,
        name: design.name,
        imageUrl: design.imageUrl,
        sortOrder: design.sortOrder,
        group: {
          id: design.group.id,
          name: design.group.name
        }
      };
      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }

  @Get('')
  private async getAll(req: Request<void, IBaseDesign[], void, void>, res:Response<IBaseDesign[]>): Promise<Response<IBaseDesign[]>> {
    Logger.Info(req.params, true);

    try {
      const repo: Repository<BaseDesign> = getRepository(BaseDesign);
      const allDesigns: BaseDesign[] = await repo.find({relations: ['group']});

      const ret: IBaseDesign[] = allDesigns.map((design: BaseDesign): IBaseDesign => {
        if (!design.id) {
          throw 'base design id not defined, should not reach here';
        }

        if (!design.group.id) {
          throw 'group id not defined, should not reach here';
        }

        return {
          id: design.id,
          name: design.name,
          imageUrl: design.imageUrl,
          sortOrder: design.sortOrder,
          group: {
            id: design.group.id,
            name: design.group.name
          }
        };
      });

      return res.status(StatusCodes.OK).json(ret);
    } catch (err: any) {
      Logger.Err(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();
    }
  }
}
