import { Injectable } from '@angular/core';
import { IErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { InsightsService } from './insights.service';

@Injectable()
export class CustomErrorHandler implements IErrorService {

    constructor(private insightsService: InsightsService) {}

    handleError(error: Error) {
        this.insightsService.logException(error); // Manually log exception
        const originalError = this.getOriginalError(error);
        if (originalError !== error) {
            this.insightsService.logException(originalError); // Manually log original exception
        }
    }

    private getOriginalError(error: any) {
        while (error && error.originalError) {
            error = error.originalError;
        }
        return (error);
    }
}
