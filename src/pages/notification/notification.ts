import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications/notifications";

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationService: NotificationsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
