import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
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
  notification_num = 0;

  constructor(public notificationService: NotificationsProvider) {
    notificationService.count_my_notification().then(numb => {
      this.notification_num = numb;
    })
  }

}
