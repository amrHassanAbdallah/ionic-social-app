import {NgModule} from '@angular/core';
import {PostEditComponent} from './post-edit/post-edit';
import {PostPage} from "../pages/post/post";

@NgModule({
  declarations: [PostEditComponent],
  imports: [PostPage],
  exports: [PostEditComponent]
})
export class ComponentsModule {
}
