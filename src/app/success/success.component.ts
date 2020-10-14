import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  public paymentStatus:string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paymentStatus = this.route.snapshot.queryParamMap.get("status")
  }

}
