import * as bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { FlowerStandController } from './controller/FlowerStandController';
import { ParticipantController } from './controller/ParticipantController';
import { BaseDesignController } from './controller/BaseDesignController';
import { EventController } from './controller/EventController';
import { GroupController } from './controller/GroupController';

class FlowerStandServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.app.use(bodyParser.json({limit: '1024kb'}));
    this.app.use(bodyParser.urlencoded({extended: true, limit: '1024kb'}));
    this.app.use(cors());
    this.setupControllers();
  }

  private setupControllers(): void {
    const flowerStandController: FlowerStandController = new FlowerStandController();
    const participantController: ParticipantController = new ParticipantController();
    const baseDesignController: BaseDesignController = new BaseDesignController();
    const eventController: EventController = new EventController();
    const groupController: GroupController = new GroupController();
    super.addControllers([flowerStandController, participantController, baseDesignController, eventController, groupController]);
  }

  public start(port: number): void {
    this.app.listen(port, (): void => {
      Logger.Imp(`server listening on port ${port}`);
    });
  }
}

export default FlowerStandServer;
