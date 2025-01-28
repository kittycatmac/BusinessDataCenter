import moment from 'moment';
// API calls
import { putEdit } 
    from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

// populates the each tab with data
export const updateCellData = async ({updatedRow}) => {
    // resets totalQty
    updatedRow.totalQty = 
    (updatedRow.quantitySkids * updatedRow.qtyPerSkid) + (updatedRow.quantityCartons * updatedRow.qtyPerCarton);

    // resets totalLooseQty
    let total = updatedRow.inches/updatedRow.smiCaliper;
    let rounded = total.toFixed(3);
    updatedRow.totalLooseQty = rounded;

    // resets totalOH
    let totalOH = Number(updatedRow.totalQty) + Number(updatedRow.totalLooseQty);
    let roundedOH = totalOH.toFixed();
    updatedRow.totalOH = roundedOH;

    const id = updatedRow.id;
    const putBody = { 
        id: updatedRow.id,
        gridId: updatedRow.gridId,
        smiId: updatedRow.smiId,
        productId: updatedRow.productId,
        smiDesc: updatedRow.smiDesc,
        smiLength: updatedRow.smiLength,
        smiWidth: updatedRow.smiWidth,
        smiType: updatedRow.smiType,
        smiBwt: updatedRow.smiBwt,
        smiCaliper: updatedRow.smiCaliper,
        smiQoh: updatedRow.smiQoh,
        qtyPerSkid:  parseInt(updatedRow.qtyPerSkid),
        qtyPerCarton:  parseInt(updatedRow.qtyPerCarton),
        quantitySkids:  parseInt(updatedRow.quantitySkids),
        quantityCartons:  parseInt(updatedRow.quantityCartons),
        totalQty: parseInt(updatedRow.totalQty),
        inches: parseFloat(updatedRow.inches),
        tab: updatedRow.tab,
        totalLooseQty: parseFloat(updatedRow.totalLooseQty),
        totalOH: parseFloat(updatedRow.totalOH),
        dateTime: moment().format('YYYY-MM-DDTHH:mm'),
        location: updatedRow.location,
        notes: updatedRow.notes, 
    };

    try {
        const json = await putEdit(id, putBody);
        return json;
    } catch (error) {
        console.log("error", error);
    }
};