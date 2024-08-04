$(document).ready(function () {

    alertify.set('notifier','position', 'top-right');

    //alertify.success('res.message');
    
    $(document).on('click', '.increment', function () {
        var $quantityInput = $(this).closest('.qtybox').find('.qty');
        var quantityId = $(this).closest('.qtybox').find('.prodId').val();

        var currentValue = parseInt($quantityInput.val());

        if(!isNaN(currentValue)){
            var qtyVal = currentValue +1;
            $quantityInput.val(qtyVal);
            quantityInDe(quantityId, qtyVal);
        }

    });


    $(document).on('click', '.decrement', function () {
        var $quantityInput = $(this).closest('.qtybox').find('.qty');
        var quantityId = $(this).closest('.qtybox').find('.prodId').val();

        var currentValue = parseInt($quantityInput.val());

        if(!isNaN(currentValue) && currentValue > 1){
            var qtyVal = currentValue -1;
            $quantityInput.val(qtyVal);
            quantityInDe(quantityId, qtyVal);
        }

    });


    function quantityInDe(prodId, qty)
{
    $.ajax({
        type : "POST",
        url : "orders-code.php",
        data : {
            'productInDe' : true,
            'product_Id' : prodId,
            'quantity' : qty,
        },

        success: function(response) {
            var res = JSON.parse(response);

            if(res.status == 200){
              //  window.location.reload();
              $('#productArea').load(' #productContent');
                alertify.success(res.message);
            }else{
                $('#productArea').load(' #productContent');
                alertify.error();(res.message);
            }
        }
    })
    }



    // proceed to place order 
    $(document).on('click', '.placeOrder', function () {
        

        var payment_mode = $('#payment_mode').val();
        var cphone = $('#cphone').val();
        var amountPaid = $('#amountPaid').val();
     
        if(payment_mode == ''){
            swal("Select Payment Mode","Select Your Payment Mode", "warning");
            return false;
        }

        if(cphone == '' && !$.isNumeric(cphone)){
            swal("Enter Phone Number","Enter valid Number", "warning");
            return false;
        }

        if(amountPaid == '' && !$.isNumeric(amountPaid)){
            swal("Enter Amount","", "warning");
            return false;
        }

        if(!$.isNumeric(amountPaid)){
            swal("Amount must be numeric","", "warning");
            return false;
        }

        var data = {
            'placeOrder' : true,
            'payment_mode' : payment_mode,
            'cphone' : cphone,
            'amountPaid' : amountPaid
        }

        $.ajax({
            type : "POST",
            url : "orders-code.php",
            data : data,

            success: function(response) {
                var res = JSON.parse(response);
                if(res.status == 200){
                    window.location.href = "order-summary.php"

                }else if(res.status == 404){
                    swal(res.message, res.message, res.status_type, {
                        buttons: {
                            catch :{
                                text : "Add Cuatomer",
                                value: "catch"
                            },
                            cancel : "Cancel"

                        }
                    })

                    .then((value) => {
                        switch(value){
                            case "catch":
                                $('#c_phone').val(cphone);
                                $('#addCustomerModal').modal('show');
                                //console.log('Pop the customer');
                                break;
                                default:
                        }
                    })

                }else{
                    swal(res.message, res.message, res.status_type);
                }
            }
        })

    });


    // Add customer 

    $(document).on('click', '.saveCustomer', function () {
        var c_name = $('#c_name').val();
        var c_phone = $('#c_phone').val();
        var c_email = $('#c_email').val();

        if(c_name != '' && c_phone != '')
        {
            if($.isNumeric(c_phone))
            {
                var data = {
                    'saveCustomerBtn' : true,
                    'name' : c_name,
                    'phone' : c_phone,
                    'email' : c_email,
                };

                $.ajax({
                    type : "POST",
                    url : "orders-code.php",
                    data : data,
                    
                    success: function(response) {
                        var res = JSON.parse(response);
    
                        if(res.status == 200){
                            swal(res.message, res.message, res.status_type);
                            $('addCustomerModal').modal('hide');
                        }else if(res.status == 422){
                            swal(res.message, res.message, res.status_type);
                        } else{
                            swal(res.message, res.message, res.status_type);
                        }
                    }
                })


            }else{
                swal("Enter valid number","","warning")
            }
        }
        else
        {
            swal("Please fill the required fields","","warning")
        }

    });


    // save order details 
    $(document).on('click', '#saveOrder', function () {

        $.ajax({
            type : "POST",
            url : "orders-code.php",
            data : {
                'saveOrder' : true
            },

            success: function(response) {
                var res = JSON.parse(response);
                if(res.status == 200){
                    swal(res.message,res.message,res.status_type);
                    $('#orderPlaceSuccessMessage').text(res.message);
                    $('#oderSuccessModal').modal('show');
                }else{
                    swal(res.message,res.message,res.status_type);
                }
            }
        })
    });



});


function printMyBillingArea() {
    var divContent = document.getElementById("myBillingArea").innerHTML;
    var a = window.open('','');
    a.document.write('<html><title> POS System in PHP</title>');
    a.document.write('<body style="font-family: fansong;">');
    a.document.write(divContent);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
};

window.jsPDF = window.jspdf.jsPDF;
var docPDF = new jsPDF();

function downnloadPDF(invoiceNo){

    var elementHTKL = document.querySelector("#myBillingArea");
    docPDF.html( elementHTKL, {
        callback: function() {
            docPDF.save(invoiceNo+'.pdf');
        },
        x: 15,
        y: 15,
        width: 170,
        window: 650
    });
}


