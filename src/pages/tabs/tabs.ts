import {Component} from '@angular/core';
import {Events, IonicPage} from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications/notifications";

/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1: string = "ChatsPage";
  tab2: string = "GroupsPage";
  tab3: string = "ProfilePage";
  tab4: string = "NotificationPage";
  notification_num;

  constructor(public notificationService: NotificationsProvider, public events: Events) {
    //notificationService.get(firebase.auth().currentUser.uid);
    notificationService.count_my_notification().then(numb => {
      this.notification_num = numb;
      if (numb == 0) {
        this.notification_num = null;
      }
    });


  }

  ionViewWillEnter() {
    this.events.subscribe('notifications', () => {
      console.log("I hear you ");
      this.notification_num = 0;
      this.notification_num = this.notificationService.active_notifications_count;
      if (this.notification_num == 0) {
        this.notification_num = null;
      }
    })

  }

}
