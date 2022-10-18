import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { ErrorHandler, NgModule } from '@angular/core';
import { InsightsService } from './insights.service';

@NgModule({
    providers: [
        InsightsService,
        {
            provide: ErrorHandler,
            useClass: ApplicationinsightsAngularpluginErrorService,
        },
    ],
})
export class InsightsModule {
    constructor(
        private insightsService: InsightsService
    ) { }
}