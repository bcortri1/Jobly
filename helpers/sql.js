const { BadRequestError } = require("../expressError");


// Example Data: 
// dataToUpdate = { ex1: "val1", example2: "val2"}
// jsToSql = {example2: "ex2"}
// Example data returns {setCols: '"ex1"=$1, "ex2"=$2', values: ['val1', 'val2'] }

// Will format provided data into an object containing part of a psql query
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  //Checks that data is not empty or missing keys
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    // Changes specified js variable names to desired psql column names while setting appropriate var id
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}


function sqlFilter(data) {
  
  //Checks for valid filter options
    const filterList=[
        "name",
        "minEmployees",
        "maxEmployees",
        "title",
        "minSalary",
        "hasEquity"
    ]
    if(!filterList.some((filter)=> Object.hasOwn(data, filter))){
        return {filterCols: "No Filter", values:[]}
    }


  else {
    let idx = 0;
    let values = [];
    let cols =[];
    
    // Current filter options
    // Case insentive name filter
    if (Object.hasOwn(data,"name")) {
      idx += 1;
      values.push(`%${data["name"]}%`)
      cols.push(`"name" ILIKE ($${idx})`);
    }
    // min and max employee filter
    if (Object.hasOwn(data,"minEmployees") && Object.hasOwn(data,"maxEmployees")) {
      idx +=2;
      if (data["minEmployees"] < data["maxEmployees"]){
        values.push(data["minEmployees"])
        values.push(data["maxEmployees"])
        cols.push(`"num_employees" BETWEEN $${idx-1} AND $${idx}`);
      }
      else{
        throw new BadRequestError("Min cannot be greater than Max")
      }
    }
    // min employee filter
    else if (Object.hasOwn(data,"minEmployees") ){
      idx +=1;
      values.push(data["minEmployees"])
      cols.push(`"num_employees">=$${idx}`);
    }
    // max employee filter
    else if (Object.hasOwn(data,"maxEmployees")) {
      idx +=1;
      values.push(data["maxEmployees"])
      cols.push(`"num_employees"<=$${idx}`);
    }

    // Case insentive title filter
    if (Object.hasOwn(data,"title")) {
        idx += 1;
        values.push(`%${data["title"]}%`)
        cols.push(`"title" ILIKE ($${idx})`);
    }
    // min salary filter
    if (Object.hasOwn(data,"minSalary") ){
        idx +=1;
        values.push(data["minSalary"])
        cols.push(`"salary">=$${idx}`);
    }
    // has equity filter
    if (Object.hasOwn(data,"hasEquity")){
        if (data.hasEquity === true){
            idx +=1;
            values.push("0")
            cols.push(`"equity">$${idx}`);
        }
        //needs to account for null
        else if(data.hasEquity === false){
            idx +=1;
            values.push("0")
            cols.push(`"equity">=$${idx}`);
        }
    }

    return {
      filterCols: cols.join(" AND "),
      values: values,
    };
  }
}

module.exports = { sqlForPartialUpdate, sqlFilter };
