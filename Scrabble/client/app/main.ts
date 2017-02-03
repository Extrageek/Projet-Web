import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";
import { UserSettingsService } from "./services/userSettingService";

platformBrowserDynamic().bootstrapModule(AppModule, [UserSettingsService]);
