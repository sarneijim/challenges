var dateSelect     = $('#bus-datepicker');
var dateDepart     = $('#departure');
var spanDepart     = $('.date-depart');
var spanDateFormat = 'ddd, MMMM D yyyy';

dateSelect.datepicker({
  orientation: "bottom",
  autoclose: true,
  format: "dd-mm-yyyy",
  startDate: "now",
});
