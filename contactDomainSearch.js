import { LightningElement,track } from 'lwc';
import getContacts from '@salesforce/apex/ContactSearch.getContacts';

export default class ContactDomainSearch extends LightningElement {
    @track contacts = []; // Empty contacts list
    @track website = '';
    @track loading = false; // Used to display spinner until contacts are loaded
    dataExists = false;
    errorResponse = '';
    error = '';
    stack = '';
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Title', fieldName: 'Title' },
        { label: 'Created Date', fieldName: 'CreatedDate' },
    ]; //Contact fields to be displayed

  handleSearch() {
    this.website = this.template.querySelector('lightning-input').value;
    //Regex expression to extract domain name from entered website
    const domain = this.website.replace(/^https?:\/\//, "")
                               .replace(/^www\./, "")
                               .replace(/\..*/, '');

    this.loading = true;
    //Calling apex method to get contacts
    getContacts({searchText:domain}).then(result=>{
      this.contacts = result;
      this.loading = false;
      if(this.contacts.length > 0){
        this.dataExists = true;
      } else {
        this.dataExists = false;
      }
    }).catch(error=>{
      this.errorResponse = error;
      this.loading = false;
      console.log(error);
    })
  }

  // if any component level error, this method is called to display error details
  errorCallback(error, stack) {
    this.error = error;
    this.stack = stack;
  }
}