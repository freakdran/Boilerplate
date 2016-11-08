var table = document.getElementById("mytable1");  // set this to your table

var tbody = document.createElement("tbody");
table.appendChild(tbody);
orderArray.forEach(function(items) {
  var row = document.createElement("tr");
  items.forEach(function(item) {
    var cell = document.createElement("td");
    cell.textContent = item;
    row.appendChild(cell);
  });
  tbody.appendChild(row);
});
