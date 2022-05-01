import { faker } from '@faker-js/faker';
import random from 'random';
import { Class } from 'src/models/class';
import { Get, OperationId, Route, Security, Tags } from 'tsoa';

export interface ClassesResponse {
  total: number;
  classes: Array<Class>;
}

@Route('v1/classes')
@Tags('classes')
export default class ClassController {
  @OperationId('getClasses')
  @Get('/')
  @Security('Authorization')
  public async getClasses(): Promise<ClassesResponse> {
    const classes: Array<Class>  = [];

    for (let i = 0; i < 30; i++) {
      classes.push({
        class_id: faker.datatype.uuid(),
        class_name: faker.name.jobTitle(),
        performance: {
          total_students: random.int(1, 20),
          average_performance: random.float(0, 1),
          today_total_classes:random.int(1, 20),
          today_activities: random.int(1, 20)
        }
      })
    }

    return {
      total: classes.length,
      classes: classes
    };
  }
}
