import moment from 'moment';
// API calls getSheet
import { postRow } 
    from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

export const pullTransferRow = async ({
    statePull,
    setselectedRow, 
    rowsPull,
    updatedRows,
    clearFormState
}) => {
    // Below creates copy for new row at current location
    const clonedArray = statePull.map(a => {return {...a}});
    const newClonedArr = clonedArray.map(obj => {
      //if(obj.newQtySkids || obj.newQtyCartons || obj.newInches) {
        let quantitySkidsNew = 0;
        if(obj.newQtySkids) {
          quantitySkidsNew = obj.quantitySkids - parseInt(obj.newQtySkids);
        } else {
          quantitySkidsNew = obj.quantitySkids;
        }
        let quantityCartonsNew = 0;
        if(obj.newQtyCartons) {
          quantityCartonsNew = obj.quantityCartons - parseInt(obj.newQtyCartons);
        } else {
          quantityCartonsNew = obj.quantityCartons;
        }
        let inchesNew = 0;
        if(obj.newInches) {
          inchesNew = obj.inches - parseFloat(obj.newInches);
        } else {
          inchesNew = obj.inches;
        }
        const totalQtyNew = 
          (quantitySkidsNew * obj.qtyPerSkid) + (quantityCartonsNew * obj.qtyPerCarton);
        const totalLooseQtyNew = inchesNew/obj.smiCaliper;
        const totalOHNew = (totalQtyNew + totalLooseQtyNew).toFixed();
        const locationNew = obj.newLocation;
        const noteNew = "Product Transferred to " + locationNew;
        delete obj.newQtySkids;
        delete obj.newQtyCartons;
        delete obj.newLocation;
        delete obj.newInches;

        return {...obj, quantitySkids: quantitySkidsNew, quantityCartons: quantityCartonsNew, inches: inchesNew,
          totalLooseQty: totalLooseQtyNew, totalQty: totalQtyNew, totalOh: totalOHNew, notes: noteNew}

      //} 
    });
    console.log('newClonedArr', newClonedArr);

    // Below creates new row to post to new location
    const newArr = statePull.map(obj => {
      if(obj.newQtySkids || obj.newQtyCartons || obj.newInches) {
        let quantitySkidsNew = 0;
        if(obj.newQtySkids) {
          quantitySkidsNew = parseInt(obj.newQtySkids);
        }
        let quantityCartonsNew = 0;
        if(obj.newQtyCartons) {
          quantityCartonsNew = parseInt(obj.newQtyCartons);
        }
        let inchesNew = 0;
        if(obj.newInches) {
          inchesNew = parseFloat(obj.newInches);
        }
        const locationNew = obj.newLocation;
        const tabNew = obj.tab = 'misc';
        const totalQtyNew = 
          (quantitySkidsNew * obj.qtyPerSkid) + (quantityCartonsNew * obj.qtyPerCarton);
        const totalLooseQtyNew = inchesNew/obj.smiCaliper;
        const totalOHNew = (totalQtyNew + totalLooseQtyNew).toFixed();
        const gridIdNew = 100;
        const noteNew = "Pulled from " + obj.location;
        delete obj.newQtySkids;
        delete obj.newQtyCartons;
        delete obj.newInches
        delete obj.newLocation;

        return {...obj, quantitySkids: quantitySkidsNew, quantityCartons: quantityCartonsNew, 
          inches: inchesNew, location: locationNew, tab: tabNew, totalQty: totalQtyNew, 
          totalLooseQty: totalLooseQtyNew, totalOh: totalOHNew, gridId: gridIdNew, notes: noteNew}

      } 
    });
    console.log('newArr', newArr);

    const postArr = newClonedArr.concat(newArr);
    console.log('postArr', postArr);
    
    // POST new row into Hudson_DataCenter DB -> SMILocations table
    postArr.forEach(function(n) {
      const postData = {
        gridId: n.gridId,
        smiId: n.smiId,
        productId:  n.productId,
        smiDesc: n.smiDesc,
        smiLength: n.smiLength,
        smiWidth: n.smiWidth,
        smiType: n.smiType,
        smiBwt: n.smiBwt,
        smiCaliper: n.smiCaliper,
        smiQoh: n.smiQoh,
        qtyPerSkid:  parseInt(n.qtyPerSkid),
        qtyPerCarton:  parseInt(n.qtyPerCarton),
        quantitySkids:  parseInt(n.quantitySkids),
        quantityCartons:  parseInt(n.quantityCartons),
        totalQty:  parseInt(n.totalQty),
        inches: parseFloat(n.inches),
        tab: n.tab,
        totalLooseQty: parseFloat(n.totalLooseQty),
        totalOH: parseFloat(n.totalOh),
        dateTime: moment().format('YYYY-MM-DDTHH:mm'),
        location: n.location,
        notes: n.notes, 
      };

      // POST
      (async () => {
        try{
          const response = await postRow(postData);
          //return response;
          if(response) {
            // triggers the delete call
            setselectedRow(rowsPull);
            updatedRows();
            clearFormState();
          }
        } catch (error) {
          console.log("error", error);
        }
      })(); 
    });
};