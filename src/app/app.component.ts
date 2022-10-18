import { Component } from '@angular/core';
import { InsightsService } from './insights.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private insightsService: InsightsService, private http: HttpClient) {}

  dependencyHttp() {
    var data = this.http.get(`https://jsonplaceholder.typicode.com/posts`) as Observable<any>;
    data.subscribe(_ => { });
  }

  login() {
    this.insightsService.setUserId("ARBEMS", "AlbertoMoreno01");
  }

  logout() {
    this.insightsService.clearUserId();
  }
  
  UnhandledError() {
    throw new Error('Custom Error Exception unhandled');
  }
  
  HandledError() {
    try{
      throw new Error('Custom Error Exception handled');
    }
    catch(err: any)
    {
      this.insightsService.logException(err, SeverityLevel.Error);
    }
  }

  throwError(code: number) {
    var dataError = this.http.get(`https://httpbin.org/status/${code}`) as Observable<any>;
    dataError.subscribe(_ => { });
  }

  customEvent() {
    this.insightsService.logEvent("Custom event throw", {property1: "property1", property2: "property2", property3: "property3"});
  }

  customTrace() {
    this.insightsService.logTrace("Custom trace throw", {property1: "property1", property2: "property2", property3: "property3"});
  }

  customMetric() {
    this.insightsService.logMetric("Custom metric throw", 1, {property1: "property1", property2: "property2", property3: "property3"});
  }
}
