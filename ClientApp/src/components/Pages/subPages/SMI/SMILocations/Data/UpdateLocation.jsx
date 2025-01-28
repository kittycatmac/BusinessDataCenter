import moment from 'moment';
// API calls
import { postRow } 
    from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

// populates the each tab with data when adding new row
export const populatesAddNewRow = async ({input, tabsLabels}) => {
  // sets totalQty
  input.totalQty = 
    (input.quantitySkids * input.qtyPerSkid) + (input.quantityCartons * input.qtyPerCarton);
  // sets totalLooseQty
  let total = input.inches/input.smiCaliper;
  let rounded = total.toFixed(3);
  input.totalLooseQty = rounded;
  // sets totalOH
  let totalOH = Number(input.totalQty) + Number(input.totalLooseQty);
  let roundedOH = totalOH.toFixed();
  input.totalOH = roundedOH;
  // saves specific tab and checks for trailer location
  if(input.location === 'Trailer') {
    switch(tabsLabels) { 
      case 1:
        input.tab = 'S-126';
        break;
      case 2:
        input.tab = 'S-369';
        break;
      case 3:
        input.tab = 'S-254';
        break;
      case 4:
        input.tab = 'S-287';
        break;
      case 5:
        input.tab = 'S-382';
        break;
      case 6:
        input.tab = 'S-170';
        break;
      case 7:
        input.tab = 'S-326';
        break;
      case 8:
        input.tab = 'S-383';
        break;
      case 9:
        input.tab = 'S-243';
        break;
      case 10:
        input.tab = 'S-307';
        break;
      case 11:
        input.tab = 'S-370';
        break;
      case 12:
        input.tab = 'misc';
        break;
    }
  } else {
    switch(tabsLabels) {
      case 1:
        input.tab = 'skids';
        break;
      case 2:
        input.tab = 'cartons';
        break;
      case 3:
        input.tab = 'misc';
    }
  }

  // POST new row into Hudson_DataCenter DB -> SMILocations table
  const postData = {
    gridId: input.gridId,
    smiId: input.smiId,
    productId:  input.productId,
    smiDesc: input.smiDesc,
    smiLength: input.smiLength,
    smiWidth: input.smiWidth,
    smiType: input.smiType,
    smiBwt: input.smiBwt,
    smiCaliper: input.smiCaliper,
    smiQoh: input.smiQoh,
    qtyPerSkid:  parseInt(input.qtyPerSkid) ? parseInt(input.qtyPerSkid) : 0,
    qtyPerCarton:  parseInt(input.qtyPerCarton) ? parseInt(input.qtyPerCarton) : 0,
    quantitySkids:  parseInt(input.quantitySkids) ? parseInt(input.quantitySkids) : 0,
    quantityCartons:  parseInt(input.quantityCartons) ? parseInt(input.quantityCartons) : 0,
    totalQty:  parseInt(input.totalQty),
    inches: parseFloat(input.inches) ? parseFloat(input.inches) : 0,
    tab: input.tab,
    totalLooseQty: parseFloat(input.totalLooseQty),
    totalOH: parseFloat(input.totalOH),
    dateTime: moment().format('YYYY-MM-DDTHH:mm'),
    location: input.location,
    notes: input.notes,
  };
  console.log(postData);

  // POST
  try{
      const response = await postRow(postData);
      return response;
  } catch (error) {
      console.log("error", error);
  }
};