import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { CustomErrorHandler } from './custom-error-handler';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class InsightsService {
    private angularPlugin = new AngularPlugin();
    private appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: environment.appInsights.instrumentationKey,
            enableCorsCorrelation: true,
            extensions: [this.angularPlugin],
            extensionConfig: {
                [this.angularPlugin.identifier]: {
                    router: this.router,
                    errorServices: [new CustomErrorHandler(this)]
                },
            },
        },
    });

    constructor(private router: Router) {
        this.appInsights.loadAppInsights();
    }

    logPageView(name?: string, uri?: string) {
        this.appInsights.trackPageView({ name, uri });
    }
    startTrackPage(name?: string) {
        this.appInsights.startTrackPage(name);
    }
    stopTrackPage(name?: string, url?: string, customProperties?: {[key: string]: any;}, measurements?: {[key: string]: number;}) 
    {
        this.appInsights.stopTrackPage(name, url, customProperties, measurements);
    }

    logEvent(name: string, properties?: { [key: string]: any }) {
        this.appInsights.trackEvent({ name: name }, properties);
    }
    startTrackEvent(name?: string | undefined) {
        this.appInsights.startTrackEvent(name)
    }
    stopTrackEvent(name?: string | undefined) {
        this.appInsights.startTrackEvent(name)
    }

    logTrace(message: string, properties?: { [key: string]: any }) {
        this.appInsights.trackTrace({ message: message }, properties);
    }

    logException(exception: Error, severityLevel?: number) {
        this.sendToConsole(exception, severityLevel);
        this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
    }

    logMetric(name: string, average: number, properties?: { [key: string]: any }) {
        this.appInsights.trackMetric({ name: name, average: average }, properties);
    }

    setUserId(authenticatedUserId: string, accountId?: string) {
        this.appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId, true);
    }
    clearUserId() {
        this.appInsights.clearAuthenticatedUserContext();
    }

    flush() {
        this.appInsights.flush(true);
    }

    private sendToConsole(error: any, severityLevel: SeverityLevel = SeverityLevel.Error) {
        switch (severityLevel) {
            case SeverityLevel.Critical:
            case SeverityLevel.Error:
                (<any>console).group('Error:');
                console.error(error);
                if (error.message) {
                    console.error(error.message);
                }
                if (error.stack) {
                    console.error(error.stack);
                }
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Warning:
                (<any>console).group('Warning:');
                console.warn(error);
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Information:
                (<any>console).group('Information:');
                console.log(error);
                (<any>console).groupEnd();
                break;
        }
    }
}