var streetName = '50 Perry Street, Ground Floor,';
var streetName1 = streetName.substring(0, streetName.indexOf(','));
var streetName3 = streetName1 + ', New York, NY';
var streetName4 = streetName3.split(' ').join('+');
console.log(streetName4);