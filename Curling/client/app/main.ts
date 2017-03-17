import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { UserSettingService } from './services/user-setting.service';
import { GameStatusService } from './services/game-status.service';

import { AppModule } from './modules/app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule, [UserSettingService, GameStatusService]);

