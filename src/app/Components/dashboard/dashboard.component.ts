import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RestaurantData } from 'src/app/models/restaurantModel';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  formValue!: FormGroup;
  restaurantModelObj: RestaurantData = new RestaurantData();
  allRestaurantData$ !: Observable<RestaurantData[]>;
  showAdd! :boolean;
  showUpdate! :boolean;
  isLogin!: boolean;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      services: [''],
    });

    this.getAllData();
  }

  clickAddRestaurant(){
    this.formValue.reset();
    this.showAdd=true;
    this.showUpdate= false;
  }
  //now subscribing our data which is being mapped via services

  addRestaurant() {
    this.restaurantModelObj.name = this.formValue.value.name;
    this.restaurantModelObj.email = this.formValue.value.email;
    this.restaurantModelObj.mobile = this.formValue.value.mobile;
    this.restaurantModelObj.address = this.formValue.value.address;
    this.restaurantModelObj.services = this.formValue.value.services;

    this.api.postRestaurant(this.restaurantModelObj).subscribe(
      (res) => {
        console.log(res);
        alert('Added succesfully');

        let ref= document.getElementById('clear');
        ref?.click();

        this.formValue.reset();
        this.getAllData();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllData(){
      this.allRestaurantData$ = this.api.getRestaurant();
  }

  deleteData(data:any){
    this.api.deleteRestaurant(data.id).subscribe(x=>{
      alert("Successfully deleted");
      this.getAllData();
    });
  }

  onEditRestaurant(data:any){
    this.restaurantModelObj.id= data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['services'].setValue(data.services);

    this.showAdd=false;
    this.showUpdate= true;
  }

  updateRestaurant(){
    
    this.restaurantModelObj.name = this.formValue.value.name;
    this.restaurantModelObj.email = this.formValue.value.email;
    this.restaurantModelObj.mobile = this.formValue.value.mobile;
    this.restaurantModelObj.address = this.formValue.value.address;
    this.restaurantModelObj.services = this.formValue.value.services;


    this.api.updateRestaurant(this.restaurantModelObj, this.restaurantModelObj.id).subscribe(x=>{
      alert("Updated Successfully");

      let ref= document.getElementById('clear');
      ref?.click();
        
        this.formValue.reset();
        this.getAllData();
    });
  }
}
