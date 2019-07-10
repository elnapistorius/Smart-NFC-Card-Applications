import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTabPage } from './package-tab.page';

import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NfcControllerService } from '../services/nfc-controller.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { LocationService } from '../services/location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SharedModule } from '../shared.module';

describe('PackageTabPage', () => {
  let component: PackageTabPage;
  let fixture: ComponentFixture<PackageTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        SharedModule       
      ],
      providers: [
        AndroidPermissions,
        LocalStorageService,
        BusinessCardsService,
        NfcControllerService,
        NFC, Ndef,
        LocationService,
        Geolocation,
        LaunchNavigator,
        Device
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});