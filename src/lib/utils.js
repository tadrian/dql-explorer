/**
 * @file Contains a set of utility functions to manipulate arrays to specific formatted strings
 * @author Dimitri Prosper <dimitri_prosper@us.ibm.com>, <dimitri.prosper@gmail.com>, https://dprosper.github.io
 * @author Scott Good <scott.good@us.ibm.com>, https://scott-good.github.io/
 * @todo see inline TODO comments
 */

function selectedToString(selectedItems) {
  let result='';
  
  selectedItems.map((item, index) => (
    result += index===0 ? `'${item}'` : `,'${item}'`
  ));

  return result;
}

//load domquery -f a_dir/sales2019.nsf -q "order_origin = 'detroit' and (order_no > 2 or order_no < 1000000)"
//load domquery -f a_dir/sales2019.nsf -q "(form = 'orders' and order_origin = 'detroit') or (form = 'address' and city = 'philadelphia')"

export function queryToString(query, pos, formviewfolder, fvfName) {
  let result='';

  let type = query.id.split("~")[0];

  if (pos && pos !== 0 && query.boolean) {
    result += ` ${query.boolean} `;
  }

  if (type === "group") {
    let i;
    let length;

    if (query.parentId === '0000' && query.children.length > 1) result += '('; // query.boolean && pos && 

    for (i = 0, length = query.children.length; i < length; ++i) {
      result += queryToString(query.children[i], i, formviewfolder, fvfName);
    }

    if (query.parentId === '0000' && query.children.length > 1) result += ')'; // pos !== 0 && pos && query.boolean && 

  } else {
    // type == condition
    if (query.options && query.options.length > 0) {
      result += `${query.identifier} ${query.operator} (${selectedToString(query.selectedItems)})`;
    } else {
      if (query.valueType === 'text') {
        result += formviewfolder === 'views' ? `'${fvfName}'.${query.identifier} ${query.operator} '${query.value}'` : formviewfolder === 'folders' ? `'${fvfName}'.${query.identifier} ${query.operator} '${query.value}'` : `${query.identifier} ${query.operator} '${query.value}'`;
      }

      if (query.valueType === 'number') {
        result += `${query.identifier} ${query.operator} ${query.value}`;
      }

      if (query.valueType === 'date') {
        result += `${query.identifier} ${query.operator} @dt('${query.value}')`;
      }
    }
  }

  return result;
};

export function columnsToString(fields) {
  let result='';

  fields.map((field, index) => {
    if (index === 0) 
      result += field;
    else 
      result += `,${field}`

    return null;
  })
  return result;
};
