document.addEventListener('DOMContentLoaded', function() {
    // Áp dụng cho tất cả các nút toggle password trên trang
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Tìm input password liền kề trước nút này
            const passwordInput = this.previousElementSibling;

            if (passwordInput && (passwordInput.type === 'password' || passwordInput.type === 'text')) {
                // Thay đổi type của input
                const currentType = passwordInput.getAttribute('type');
                passwordInput.setAttribute('type', currentType === 'password' ? 'text' : 'password');

                // Thay đổi icon (nếu bạn muốn thay đổi icon mắt đóng/mở)
                // Ví dụ: this.textContent = currentType === 'password' ? '🙈' : '👁️';
                // Hoặc nếu dùng class Font Awesome:
                // const icon = this.querySelector('i');
                // if (icon) {
                //     icon.classList.toggle('fa-eye');
                //     icon.classList.toggle('fa-eye-slash');
                // }
            }
        });
    });

    // (Tùy chọn) Xử lý submit form (ví dụ: validation cơ bản hoặc gửi AJAX)
    // Ví dụ cho form đăng nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn submit mặc định để xử lý bằng JS
            console.log('Login form submitted');
            // Thêm logic validation hoặc gửi dữ liệu ở đây
            // const emailOrPhone = document.getElementById('emailOrPhone').value;
            // const password = document.getElementById('password').value;
            // console.log('Email/Phone:', emailOrPhone, 'Password:', password);
            // alert('Đăng nhập thành công! (Đây là demo)');
        });
    }

    // Ví dụ cho form đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Register form submitted');
            const fullName = document.getElementById('fullName').value;
            const emailOrPhone = document.getElementById('emailOrPhone').value; // Cần ID khác nếu trùng
            const password = document.getElementById('password').value; // Cần ID khác nếu trùng
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            // Thêm logic validation hoặc gửi dữ liệu ở đây
            // console.log('Full Name:', fullName, 'Email/Phone:', emailOrPhone, 'Password:', password);
            // alert('Đăng ký thành công! (Đây là demo)');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const productImageInput = document.getElementById('productImage');
    const imagePreviewDiv = document.getElementById('imagePreview');
    const previewImageTag = document.getElementById('previewImageTag');
    const uploadAreaLabel = document.querySelector('.image-uploader .upload-area');

    if (productImageInput) {
        productImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                        previewImageTag.src = e.target.result;
                        imagePreviewDiv.style.display = 'block';
                        uploadAreaLabel.style.display = 'none'; // Hide upload prompt
                    }
                }
                reader.readAsDataURL(file);
            } else {
                // No file selected or selection cancelled
                if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                    previewImageTag.src = '#';
                    imagePreviewDiv.style.display = 'none';
                    uploadAreaLabel.style.display = 'flex'; // Show upload prompt
                }
            }
        });
    }

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Basic form validation example
            const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;
            const productCategory = document.getElementById('productCategory').value;

            if (!productName.trim()) {
                alert('Vui lòng nhập tên sản phẩm.');
                return;
            }
            if (!productPrice.trim()) {
                alert('Vui lòng nhập giá bán.');
                return;
            }
            if (!productCategory) {
                alert('Vui lòng chọn danh mục sản phẩm.');
                return;
            }

            // Here you would typically gather form data and send it to a server
            // For example, using FormData:
            const formData = new FormData(addProductForm);

            // Example: Log form data to console
            console.log('Dữ liệu biểu mẫu:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // After successful submission, you might want to:
            // - Show a success message
            // - Reset the form: addProductForm.reset(); previewImageTag.src = '#'; imagePreviewDiv.style.display = 'none'; uploadAreaLabel.style.display = 'flex';
            // - Redirect to another page
            alert('Sản phẩm đã được thêm (giả lập)! Kiểm tra console để xem dữ liệu.');
        });
    }

    const cancelButton = document.querySelector('.btn-cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // Logic for cancel button, e.g., clear form or redirect
            if (confirm('Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
                addProductForm.reset();
                if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                    previewImageTag.src = '#';
                    imagePreviewDiv.style.display = 'none';
                    uploadAreaLabel.style.display = 'flex';
                }
                // Optionally redirect: window.location.href = 'some-other-page.html';
                console.log('Hành động thêm sản phẩm đã được hủy.');
            }
        });
    }

    // Add more JavaScript functionalities as needed:
    // - Dynamic loading of categories
    // - More sophisticated form validation
    // - Interactions with the top navigation or sidebar (e.g., toggling sidebar on mobile)
});
document.addEventListener('DOMContentLoaded', function() {
    const categoryImageInput = document.getElementById('categoryImage');
    const imagePreviewDiv = document.getElementById('imagePreview');
    const previewImageTag = document.getElementById('previewImageTag');
    const uploadAreaLabel = document.querySelector('.image-uploader .upload-area');

    if (categoryImageInput) {
        categoryImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                        previewImageTag.src = e.target.result;
                        imagePreviewDiv.style.display = 'block';
                        uploadAreaLabel.style.display = 'none'; // Hide upload prompt
                    }
                }
                reader.readAsDataURL(file);
            } else {
                if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                    previewImageTag.src = '#';
                    imagePreviewDiv.style.display = 'none';
                    uploadAreaLabel.style.display = 'flex'; // Show upload prompt
                }
            }
        });
    }

    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const categoryName = document.getElementById('categoryName').value;
            const categoryDescription = document.getElementById('categoryDescription').value;

            if (!categoryName.trim()) {
                alert('Vui lòng nhập tên danh mục.');
                return;
            }
            // Mô tả có thể không bắt buộc, tùy theo yêu cầu
            // if (!categoryDescription.trim()) {
            //     alert('Vui lòng nhập mô tả danh mục.');
            //     return;
            // }

            const formData = new FormData(addCategoryForm);

            console.log('Dữ liệu biểu mẫu danh mục:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            alert('Danh mục đã được thêm (giả lập)! Kiểm tra console để xem dữ liệu.');
            // addCategoryForm.reset();
            // if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
            //     previewImageTag.src = '#';
            //     imagePreviewDiv.style.display = 'none';
            //     uploadAreaLabel.style.display = 'flex';
            // }
        });
    }

    const cancelButton = document.querySelector('.btn-cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
                addCategoryForm.reset();
                if (previewImageTag && imagePreviewDiv && uploadAreaLabel) {
                    previewImageTag.src = '#';
                    imagePreviewDiv.style.display = 'none';
                    uploadAreaLabel.style.display = 'flex';
                }
                console.log('Hành động thêm danh mục đã được hủy.');
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Quantity control
    const quantityControls = document.querySelectorAll('.quantity-control');

    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.minus-btn');
        const plusBtn = control.querySelector('.plus-btn');
        const input = control.querySelector('.quantity-input');
        const productId = minusBtn.dataset.id; // Assuming buttons and input share a data-id

        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(input.value);
            if (currentValue > 0) { // Or min value from input.min
                input.value = currentValue - 1;
                console.log(`Product ID ${productId} quantity decreased to: ${input.value}`);
                // Add AJAX call here to update server
            }
        });

        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            console.log(`Product ID ${productId} quantity increased to: ${input.value}`);
            // Add AJAX call here to update server
        });

        // Optional: Handle direct input changes if input is not readonly
        // input.addEventListener('change', function() {
        //     let newValue = parseInt(input.value);
        //     if (isNaN(newValue) || newValue < 0) {
        //         input.value = 0; // Or previous valid value
        //     }
        //     console.log(`Product ID ${productId} quantity changed to: ${input.value}`);
        //     // Add AJAX call here to update server
        // });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${productId} không?`)) {
                console.log(`Xóa sản phẩm ID: ${productId}`);
                // Add AJAX call here to delete product from server
                // On success, remove the row from the table:
                // this.closest('tr').remove();
                alert(`Sản phẩm ID: ${productId} đã được xóa (giả lập).`);
            }
        });
    });

    // Pagination (Basic example - logs to console)
    const pageButtons = document.querySelectorAll('.pagination .page-num, .pagination .page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active') || this.disabled) {
                return;
            }

            const pageText = this.textContent.trim();
            let pageNumber;

            if (this.classList.contains('prev-btn')) {
                console.log('Chuyển đến trang trước');
                // Logic to determine previous page number
            } else if (this.classList.contains('next-btn')) {
                console.log('Chuyển đến trang kế');
                // Logic to determine next page number
            } else if (pageText === '...') {
                console.log('Nút ... được nhấp');
                // Logic for ellipsis button
            }
            else {
                pageNumber = parseInt(pageText);
                console.log(`Chuyển đến trang: ${pageNumber}`);
            }

            // In a real app, you would:
            // 1. Update the 'active' class on pagination buttons
            // 2. Fetch data for the new page via AJAX
            // 3. Re-render the table with new data
            // 4. Update prev/next button disabled states
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa danh mục ID: ${categoryId} không?`)) {
                console.log(`Xóa danh mục ID: ${categoryId}`);
                // Add AJAX call here to delete category from server
                // On success, remove the row from the table:
                // this.closest('tr').remove();
                alert(`Danh mục ID: ${categoryId} đã được xóa (giả lập).`);
            }
        });
    });

    // Pagination (Basic example - logs to console)
    const pageButtons = document.querySelectorAll('.pagination .page-num, .pagination .page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active') || this.disabled) {
                return;
            }

            const pageText = this.textContent.trim();
            let pageNumber;

            if (this.classList.contains('prev-btn')) {
                console.log('Chuyển đến trang trước (danh mục)');
                // Logic to determine previous page number
            } else if (this.classList.contains('next-btn')) {
                console.log('Chuyển đến trang kế (danh mục)');
                // Logic to determine next page number
            } else if (pageText === '...') {
                console.log('Nút ... được nhấp (danh mục)');
                // Logic for ellipsis button
            }
            else {
                pageNumber = parseInt(pageText);
                console.log(`Chuyển đến trang (danh mục): ${pageNumber}`);
            }

            // In a real app, you would:
            // 1. Update the 'active' class on pagination buttons
            // 2. Fetch data for the new page via AJAX
            // 3. Re-render the table with new data
            // 4. Update prev/next button disabled states
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountId = this.dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ID: ${accountId} không?`)) {
                console.log(`Xóa tài khoản ID: ${accountId}`);
                // Add AJAX call here to delete account from server
                // On success, remove the row from the table:
                // this.closest('tr').remove();
                alert(`Tài khoản ID: ${accountId} đã được xóa (giả lập).`);
            }
        });
    });

    // Pagination (Basic example - logs to console)
    const pageButtons = document.querySelectorAll('.pagination .page-num, .pagination .page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active') || this.disabled) {
                return;
            }

            const pageText = this.textContent.trim();
            let pageNumber;

            if (this.classList.contains('prev-btn')) {
                console.log('Chuyển đến trang trước (tài khoản)');
                // Logic to determine previous page number
            } else if (this.classList.contains('next-btn')) {
                console.log('Chuyển đến trang kế (tài khoản)');
                // Logic to determine next page number
            } else if (pageText === '...') {
                console.log('Nút ... được nhấp (tài khoản)');
                // Logic for ellipsis button
            }
            else {
                pageNumber = parseInt(pageText);
                console.log(`Chuyển đến trang (tài khoản): ${pageNumber}`);
            }

            // In a real app, you would:
            // 1. Update the 'active' class on pagination buttons
            // 2. Fetch data for the new page via AJAX
            // 3. Re-render the table with new data
            // 4. Update prev/next button disabled states
        });
    });

    // Optional: Logic for the "Xóa" toggle in the header if you implement it
    // const toggleAllDelete = document.getElementById('toggleAllDelete');
    // if (toggleAllDelete) {
    //     toggleAllDelete.addEventListener('change', function() {
    //         const isChecked = this.checked;
    //         console.log(`Chế độ xóa hàng loạt: ${isChecked ? 'BẬT' : 'TẮT'}`);
    //         // Add logic to show/hide individual delete buttons or change their appearance
    //         // Or enable a "Delete Selected" button
    //     });
    // }
});
document.addEventListener('DOMContentLoaded', function() {
    const statusControls = document.querySelectorAll('.status-control');

    statusControls.forEach(control => {
        const statusBtn = control.querySelector('.status-btn');
        const statusDropdown = control.querySelector('.status-dropdown');
        const orderId = statusBtn.dataset.orderId;

        statusBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from closing immediately if bubbling
            // Toggle display of current dropdown
            closeAllDropdowns(statusDropdown); // Close others before opening current
            statusDropdown.style.display = statusDropdown.style.display === 'none' ? 'block' : 'none';
        });

        statusDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const newStatus = this.dataset.status;
                const newStatusText = this.textContent;

                // Update button text and class
                statusBtn.textContent = newStatusText;
                statusBtn.appendChild(document.createRange().createContextualFragment(' <i class="fas fa-caret-down"></i>')); // Re-add icon

                // Remove old status classes and add new one
                statusBtn.classList.remove('status-pending', 'status-processing', 'status-shipping', 'status-delivered', 'status-cancelled');
                statusBtn.classList.add(`status-${newStatus}`);

                statusDropdown.style.display = 'none'; // Hide dropdown

                console.log(`Order ID: ${orderId}, New Status: ${newStatusText} (${newStatus})`);
                // Here, you would make an AJAX call to update the order status on the server
                // Example: updateOrderStatus(orderId, newStatus);
                alert(`Đã cập nhật trạng thái cho đơn hàng ${orderId} thành ${newStatusText} (giả lập).`);
            });
        });
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', function() {
        closeAllDropdowns();
    });

    function closeAllDropdowns(exceptThisOne = null) {
        document.querySelectorAll('.status-dropdown').forEach(dropdown => {
            if (dropdown !== exceptThisOne) {
                dropdown.style.display = 'none';
            }
        });
    }


    // Pagination (Basic example - logs to console)
    const pageButtons = document.querySelectorAll('.pagination .page-num, .pagination .page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active') || this.disabled) {
                return;
            }

            const pageText = this.textContent.trim();
            let pageNumber;

            if (this.classList.contains('prev-btn')) {
                console.log('Chuyển đến trang trước (đơn hàng)');
            } else if (this.classList.contains('next-btn')) {
                console.log('Chuyển đến trang kế (đơn hàng)');
            } else if (pageText === '...') {
                console.log('Nút ... được nhấp (đơn hàng)');
            }
            else {
                pageNumber = parseInt(pageText);
                console.log(`Chuyển đến trang (đơn hàng): ${pageNumber}`);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // --- Sales Chart (Line Chart) ---
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'], // X-axis labels (Months)
                datasets: [{
                    label: 'Doanh số', // Legend label
                    data: [10, 25, 65, 55], // Y-axis data points (Sales numbers)
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1, // Line tension (0 for straight lines)
                    fill: false // Do not fill area under the line
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Adjust as needed, false might be better with fixed height containers
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Số lượng bán'
                        }
                    },
                    x: {
                         title: {
                            display: true,
                            text: 'Tháng'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }

    // --- Revenue Chart (Pie Chart) ---
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'pie',
            data: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: [75000000, 150000000, 185000000, 135000000], // Revenue data
                    backgroundColor: [
                        'rgb(54, 162, 235)',  // Blue
                        'rgb(255, 205, 86)',  // Yellow
                        'rgb(255, 99, 132)',   // Pink/Red
                        'rgb(75, 192, 192)'   // Green/Teal
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right', // Legend position as in image
                        labels: {
                            boxWidth: 20, // Adjust legend color box width
                            padding: 15 // Padding between legend items
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    },
                    title: { // Chart.js does not have a built-in chart title like the card title
                        display: false // We use the H3 in HTML for the title
                    }
                }
            }
        });
    }
});


