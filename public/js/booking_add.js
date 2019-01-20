$(document).ready(() => {
  var chosedate = false;
  // Lay danh sach cach khach hang
  $.ajax({
    url: "/admin/booking/data/getlistcustomer"
  }).done(data => {

      $("#select-customer").append(
        "<option value=" + -1 + ">-- Chọn khách hàng --</option>"
      );
      data.forEach(element => {
        $("#select-customer").append(
          "<option value=" + element.id + ">" + element.name + "</option>"
        );
      });
  });
  

  $("#div-booked").addClass("hidden");
  // Lấy danh sách khách sạn
  $.ajax({
    url: "/admin/booking/data/getlisthotel",
    success: data => {
      $("#select-hotel").append(
        "<option value=" + -1 + ">-- Chọn khách sạn --</option>"
      );
      data.forEach(element => {
        $("#select-hotel").append(
          "<option value=" + element.id + ">" + element.name + "</option>"
        );
      });
    }
  });

  // Khi chọn khách sạn
  $("#select-hotel").change(() => {
    // an hien cac combo box
    $("#select-room").html(null);
    if ($("#select-hotel").val() == "-1") {
      $("#div-booked").addClass("hidden");
      $("#select-room")
        .parents(".form-group")
        .addClass("hidden");
      $("#div-date").addClass("hidden");
      chosdate = false;
      return;
    }
    $("#select-room")
      .parents(".form-group")
      .removeClass("hidden");
    $("#div-booked").removeClass("hidden");
    $("#div-date").removeClass("hidden");
    // Lay danh sach phong trong khach san
    $.ajax({
      url: "/admin/booking/data/getlistroom?id=" + $("#select-hotel").val(),
      success: data => {
        if(data.length == 0) {
          $("#select-room").append(
            "<option value=" + -1 + ">" + '-- Khách sạn tạm thời chưa có phòng --'+ "</option>"
          );
          return;
        }
        data.forEach(element => {
          $("#select-room").append(
            "<option value=" + element.id + ">" + element.maso + " - id: " + element.id +  " </option>"
          );
        });
        $("#select-room").change();
        return;
      }
    });
  });

  // Khi chon phong
  $("#select-room").change(() => {
    
    chosedate = true;
    $("#reservation").val("");
    $("#booked-list").html(null);
    // Lay danh sach lich dat cua phong
    $.ajax({
      url:
        "/admin/booking/data/getdatebooked?idRoom=" + $("#select-room").val(),
      success: data => {
        $("#div-booked").removeClass("hidden");
        data.forEach(el => {
          // let $input = $('<input type ="button" value="' + el + '" class="btn btn-danger disabled"');
          // $input.appendTo($("#booked-list"));
          $("#booked-list")
            .append(
              "<input type='button' value=" + el + " class='btn btn-danger disabled'/>"
            );
        });

        return;
      }
    });
  });

  // Khi chon ngay kiem tra ngay co hop le khong
  $("#div-date").change(() => {
    if (!chosedate) return;
    let checkIn = $("#reservation")
      .val()
      .split("-")[0];
    let checkOut = $("#reservation")
      .val()
      .split("-")[1];
      console.log(checkIn, checkOut);
      
    let now = new Date();
    if(new Date(checkIn) < now + 1 || new Date(checkOut) < now + 1) {
      $("#reservation").val("");
      $('#dobook').addClass('hidden');
      return alert('Lỗi', 'Ngày chọn không hợp lệ', 'warning');
    }
      
    $.ajax({
      url:
        "/admin/booking/data/checkdate?checkin=" +
        checkIn +
        "&checkout=" +
        checkOut + "&roomid=" + $('#select-room').val()
    }).done(data => {
      if (!data) {
        Swal('Lỗi', "Ngày chọn không hợp lệ do đã có lịch đặt từ trước", 'warning');
        $("#reservation").val("");
        $('#dobook').addClass('hidden');
      } else {
        $('#dobook').removeClass('hidden')
      }
    });
  });

  // Khi nhấn nút đặt //#endregion

  $('#btn-booking').click(() => {
    let idcustomer = $('#select-customer').val();
    let idroom = $('#select-room').val();
    let checkin = $("#reservation").val().split("-")[0];
    let checkout = $("#reservation").val().split("-")[1];
    let bookingData  = {
      idcustomer : idcustomer,
      idroom: idroom,
      checkin: checkin,
      checkout: checkout
    };
    
    // Nếu dữ liệu nhập vào không chính xác
    if(idcustomer == -1 || idroom == -1 || checkin == '' || checkout == '') {
      return Swal('Lỗi','Thông tin đặt phòng không hợp lệ! \n Vui lòng kiểm tra lại', 'error');
    }

    // Gửi đơn đặt phòng lên server
    $.ajax({
      method : 'POST',
      url: '/admin/booking/add',
      data: bookingData
    }).done((result) => {
      if(result) {
        Swal('Thành công','Đặt phòng thành công', 'success');
        setTimeout(() => {
          window.location.replace('/admin/booking');
        }, 1500);
      }
      // Khi gui don thanh cong
    }).fail(err => {

    })
  })
});
