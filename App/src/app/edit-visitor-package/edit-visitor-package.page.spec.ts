/**
*	File Name:	    edit-visitor-package.page.spec.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      None
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/11	Wian		  1.0		    Original
*
*	Functional Description:   This file provides the tests for its respective component
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitorPackagePage } from './edit-visitor-package.page';
import { NavParams, ModalController, AngularDelegate } from '@ionic/angular';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RequestModuleService } from '../services/request-module.service';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Uid } from '@ionic-native/uid/ngx';
import { SharedModule } from '../shared.module';

export class NavParamsMock {
  static returnParam = null;
  public get(key): any {
    if (NavParamsMock.returnParam) {
       return NavParamsMock.returnParam
    }
    return 'default';
  }
  static setParams(value){
    NavParamsMock.returnParam = value;
  }
}

describe('EditVisitorPackagePage', () => {
  let component: EditVisitorPackagePage;
  let fixture: ComponentFixture<EditVisitorPackagePage>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisitorPackagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        SharedModule
      ],
      providers: [
        ModalController, AngularDelegate,
        RequestModuleService,
        HttpClient, HttpHandler,
        NFC, Ndef,
        AndroidPermissions,
        Uid,
        {provide: NavParams, useClass: NavParamsMock},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitorPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
