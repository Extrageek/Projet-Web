import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { UserService } from './services/user.service';
import { GameStatusService } from './services/game-status.service';

import { AppModule } from './modules/app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule, [UserService, GameStatusService]);

