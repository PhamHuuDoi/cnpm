/**
 * The Zoo Shop - Main JavaScript File
 * Xử lý tất cả các tương tác người dùng và chức năng động
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initMobileMenu();
    initPasswordToggleVisibility(); // Đã đổi tên từ initPasswordToggle
    initAuthFormValidation();
    setCurrentYear();
    initProductImageGallery();
    initDetailedInfoTabs();
    initQuantitySelector();
    updateHeaderBasedOnLogin(); // Xử lý hiển thị avatar/nút đăng nhập
    initDiscountCodeToggle();
    initUserProfileForm();
    initCartPage();
    initOrderHistoryPage();
    handleResponsive();

    // Lắng nghe sự kiện resize cửa sổ
    window.addEventListener('resize', handleResponsive);

    // ===== CÁC HÀM KHỞI TẠO =====

    /**
     * Khởi tạo menu cho thiết bị di động
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle'); // Giả sử nút toggle đã có trong HTML
        const mainMenuNav = document.querySelector('.main-menu nav');

        if (menuToggle && mainMenuNav) {
            menuToggle.addEventListener('click', function() {
                mainMenuNav.classList.toggle('active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
                if (mainMenuNav.classList.contains('active')) {
                    mainMenuNav.style.animation = 'slideDown 0.3s ease forwards';
                } else {
                    mainMenuNav.style.animation = 'slideUp 0.3s ease forwards';
                }
            });
        } else {
            // Nếu chưa có nút toggle trong HTML, tạo nó
            const mainMenuContainer = document.querySelector('.main-menu .container'); // Container của nav
            const navElement = document.querySelector('.main-menu nav');
            if (mainMenuContainer && navElement && !document.querySelector('.menu-toggle')) {
                const newMenuToggle = document.createElement('div');
                newMenuToggle.className = 'menu-toggle';
                newMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mainMenuContainer.insertBefore(newMenuToggle, navElement); // Chèn trước nav

                newMenuToggle.addEventListener('click', function() {
                    navElement.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-bars');
                        icon.classList.toggle('fa-times');
                    }
                    if (navElement.classList.contains('active')) {
                        navElement.style.animation = 'slideDown 0.3s ease forwards';
                    } else {
                        navElement.style.animation = 'slideUp 0.3s ease forwards';
                    }
                });
            }
        }
    }


    /**
     * Khởi tạo chức năng hiển thị/ẩn mật khẩu
     */
    function initPasswordToggleVisibility() {
        const toggleButtons = document.querySelectorAll('.toggle-password-visibility');
        if (!toggleButtons.length) return;

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling; // Giả sử input nằm ngay trước icon
                if (passwordInput && (passwordInput.type === 'password' || passwordInput.type === 'text')) {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);

                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-eye');
                        icon.classList.toggle('fa-eye-slash');
                    }
                }
            });
        });
    }

    /**
     * Khởi tạo kiểm tra hợp lệ cho form Đăng nhập và Đăng ký
     */
    function initAuthFormValidation() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const shippingForm = document.getElementById('shippingForm'); // Thêm form thanh toán

        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                }
                // Logic giả lập đăng nhập đã được chuyển vào file HTML của trang đăng nhập
            });
            addInputListeners(loginForm);
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                } else {
                    // Xử lý đăng ký thành công (ví dụ: hiển thị thông báo, chuyển hướng)
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    // localStorage.setItem('justRegistered', 'true'); // Có thể dùng để tự động điền email ở trang login
                    window.location.href = 'dangnhap.html';
                    event.preventDefault(); // Ngăn submit thực sự nếu chỉ là demo client-side
                }
            });
            addInputListeners(registerForm);
        }

        if (shippingForm) {
             shippingForm.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                } else {
                    alert('Thông tin giao hàng hợp lệ! Chuyển đến bước thanh toán...');
                    // Ở đây bạn sẽ xử lý logic chuyển sang bước chọn phương thức thanh toán
                    // hoặc submit dữ liệu lên server.
                    event.preventDefault(); // Ngăn submit thực sự nếu chỉ là demo client-side
                }
            });
            addInputListeners(shippingForm);
        }
    }

    function addInputListeners(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            input.addEventListener('blur', function() {
                validateField(this);
            });
            if (input.type === 'checkbox') {
                 input.addEventListener('change', function() {
                    validateField(this);
                });
            }
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function validateField(input) {
        const formGroup = input.closest('.form-group') || input.closest('.form-group-display');
        if (!formGroup) return true; // Không tìm thấy group cha, bỏ qua

        const errorMessageElement = formGroup.querySelector('.form-error-message');
        let message = '';
        let fieldValid = true;

        if (input.type === 'checkbox') {
            if (input.required && !input.checked) {
                message = 'Vui lòng đồng ý với điều khoản.';
                fieldValid = false;
            }
        } else if (input.tagName.toLowerCase() === 'select') {
            if (input.required && input.value === '') {
                message = 'Vui lòng chọn một mục.';
                fieldValid = false;
            }
        } else if (input.value.trim() === '') {
            message = 'Vui lòng không để trống trường này.';
            fieldValid = false;
        } else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                message = 'Địa chỉ email không hợp lệ.';
                fieldValid = false;
            }
        } else if (input.type === 'tel') {
            // Ví dụ kiểm tra SĐT đơn giản (chỉ chứa số, có thể thêm độ dài)
            const phonePattern = /^[0-9\s+()-]+$/;
            if (!phonePattern.test(input.value.trim())) {
                message = 'Số điện thoại không hợp lệ.';
                fieldValid = false;
            }
        } else if (input.type === 'password' && input.hasAttribute('minlength')) {
            if (input.value.length < parseInt(input.getAttribute('minlength'))) {
                message = `Mật khẩu phải có ít nhất ${input.getAttribute('minlength')} ký tự.`;
                fieldValid = false;
            }
        } else if (input.id === 'registerConfirmPassword') {
            const passwordInput = document.getElementById('registerPassword');
            if (passwordInput && input.value !== passwordInput.value) {
                message = 'Mật khẩu xác nhận không khớp.';
                fieldValid = false;
            }
        }

        if (!fieldValid) {
            input.classList.add('error');
            if (errorMessageElement) {
                errorMessageElement.textContent = message;
                errorMessageElement.style.display = 'block';
            }
        } else {
            input.classList.remove('error');
            if (errorMessageElement) {
                errorMessageElement.textContent = '';
                errorMessageElement.style.display = 'none';
            }
        }
        return fieldValid;
    }


    /**
     * Đặt năm hiện tại cho copyright footer
     */
    function setCurrentYear() {
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    /**
     * Khởi tạo gallery ảnh sản phẩm
     */
    function initProductImageGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail-item');

        if (!mainImage || !thumbnails.length) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.getAttribute('data-image') || this.src; // Ưu tiên data-image
                mainImage.alt = this.alt.replace('Thumbnail', 'Ảnh chính');

                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    /**
     * Khởi tạo tabs thông tin chi tiết sản phẩm
     */
    function initDetailedInfoTabs() {
        const tabLinks = document.querySelectorAll('.product-detailed-info .tab-link');
        const tabPanes = document.querySelectorAll('.product-detailed-info .tab-pane');

        if (!tabLinks.length || !tabPanes.length) return;

        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');

                tabLinks.forEach(l => l.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                this.classList.add('active');
                const targetPane = document.getElementById(targetTabId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    /**
     * Khởi tạo bộ chọn số lượng
     */
    function initQuantitySelector() {
        // Áp dụng cho tất cả các quantity selector trên trang
        document.querySelectorAll('.quantity-selector').forEach(selector => {
            const input = selector.querySelector('.quantity-input');
            const minusBtn = selector.querySelector('.minus-btn');
            const plusBtn = selector.querySelector('.plus-btn');

            if (!input || !minusBtn || !plusBtn) return;

            minusBtn.addEventListener('click', function() {
                let currentValue = parseInt(input.value);
                if (currentValue > (parseInt(input.min) || 1)) {
                    input.value = currentValue - 1;
                    triggerChangeEvent(input); // Kích hoạt sự kiện change để cập nhật giỏ hàng nếu cần
                }
            });

            plusBtn.addEventListener('click', function() {
                let currentValue = parseInt(input.value);
                input.value = currentValue + 1;
                triggerChangeEvent(input);
            });

            input.addEventListener('change', function() { // Xử lý khi người dùng tự nhập
                let currentValue = parseInt(input.value);
                const minVal = parseInt(input.min) || 1;
                if (isNaN(currentValue) || currentValue < minVal) {
                    input.value = minVal;
                }
                // Ở đây có thể thêm logic cập nhật giỏ hàng nếu input này nằm trong giỏ hàng
            });
        });
    }
    // Hàm trợ giúp để kích hoạt sự kiện change
    function triggerChangeEvent(element) {
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    }


    /**
     * Cập nhật Header dựa trên trạng thái đăng nhập
     */
    function updateHeaderBasedOnLogin() {
        const loginBtnHeader = document.getElementById('loginBtnHeader');
        const userAvatarHeader = document.getElementById('userAvatarHeader');
        const headerUserAvatarImg = document.getElementById('headerUserAvatarImg');
        const logoutBtnHeader = document.getElementById('logoutBtnHeader');

        if (!loginBtnHeader || !userAvatarHeader || !headerUserAvatarImg || !logoutBtnHeader) {
            return;
        }

        const loggedInUserString = localStorage.getItem('loggedInUser');

        if (loggedInUserString) {
            try {
                const user = JSON.parse(loggedInUserString);
                loginBtnHeader.style.display = 'none';
                userAvatarHeader.style.display = 'flex';
                headerUserAvatarImg.src = user.avatar || "img/avatar-placeholder.png";
                headerUserAvatarImg.alt = user.name || "User Avatar";

                if (!userAvatarHeader.dataset.eventAttached) {
                    userAvatarHeader.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const dropdown = this.querySelector('.user-dropdown-menu');
                        if (dropdown) {
                            dropdown.classList.toggle('show');
                        }
                    });
                    userAvatarHeader.dataset.eventAttached = 'true';
                }

                if (!logoutBtnHeader.dataset.eventAttached) {
                    logoutBtnHeader.addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('loggedInUser');
                        alert('Đã đăng xuất!');
                        window.location.href = 'index.html';
                    });
                    logoutBtnHeader.dataset.eventAttached = 'true';
                }
            } catch (e) {
                console.error("Lỗi parse JSON từ localStorage:", e);
                loginBtnHeader.style.display = 'flex';
                userAvatarHeader.style.display = 'none';
                localStorage.removeItem('loggedInUser');
            }
        } else {
            loginBtnHeader.style.display = 'flex';
            userAvatarHeader.style.display = 'none';
        }
    }

    document.addEventListener('click', function() {
        const openDropdown = document.querySelector('.user-dropdown-menu.show');
        if (openDropdown) {
            openDropdown.classList.remove('show');
        }
    });

    /**
     * Khởi tạo chức năng hiển thị/ẩn ô nhập mã giảm giá (Trang thanh toán)
     */
    function initDiscountCodeToggle() {
        const showDiscountBtn = document.getElementById('showDiscountCode');
        const discountInputWrapper = document.querySelector('.discount-code-input-wrapper');

        if (!showDiscountBtn || !discountInputWrapper) return;

        showDiscountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = discountInputWrapper.style.display === 'flex';
            discountInputWrapper.style.display = isOpen ? 'none' : 'flex';
            this.classList.toggle('open', !isOpen);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down', isOpen);
                icon.classList.toggle('fa-chevron-up', !isOpen);
            }
        });
    }

    /**
     * Khởi tạo form thông tin người dùng
     */
    function initUserProfileForm() {
        const profileForm = document.getElementById('userProfileForm');
        if (!profileForm) return;

        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        // Chỉ lấy input và textarea có thuộc tính readonly và không phải là email/password
        const editableFields = profileForm.querySelectorAll('input[readonly]:not(#profileEmail):not(#profilePassword), textarea[readonly]');
        const editIcons = profileForm.querySelectorAll('.edit-icon');

        let originalUserData = { // Dữ liệu mẫu, sẽ được thay thế bằng dữ liệu thật
            fullName: document.getElementById('profileFullName')?.value || "Nguyễn Văn A",
            email: document.getElementById('profileEmail')?.value || "nguyenvana@example.com",
            phone: document.getElementById('profilePhone')?.value || "0845123456789",
            address: document.getElementById('profileAddress')?.value || "123 Đường ABC, Phường XYZ, Quận 1, Tp. Hồ Chí Minh"
        };

        function populateForm(userData) {
            if(document.getElementById('profileFullName')) document.getElementById('profileFullName').value = userData.fullName;
            if(document.getElementById('profileEmail')) document.getElementById('profileEmail').value = userData.email;
            if(document.getElementById('profilePhone')) document.getElementById('profilePhone').value = userData.phone;
            if(document.getElementById('profileAddress')) document.getElementById('profileAddress').value = userData.address;
        }

        function setFormReadOnly(isReadOnly) {
            editableFields.forEach(field => {
                field.readOnly = isReadOnly;
                field.classList.toggle('editable', !isReadOnly);
            });

            editIcons.forEach(icon => {
                icon.style.display = isReadOnly ? 'inline-block' : 'none';
            });

            if(editBtn) editBtn.style.display = isReadOnly ? 'inline-block' : 'none';
            if(saveBtn) saveBtn.style.display = isReadOnly ? 'none' : 'inline-block';
            if(cancelBtn) cancelBtn.style.display = isReadOnly ? 'none' : 'inline-block';
        }

        // Load thông tin người dùng (ví dụ từ localStorage nếu có)
        const loggedInUserString = localStorage.getItem('loggedInUser');
        if (loggedInUserString) {
            try {
                const user = JSON.parse(loggedInUserString);
                // Giả sử user object có các trường tương ứng, nếu không thì dùng default
                originalUserData.fullName = user.name || originalUserData.fullName;
                originalUserData.email = user.email || originalUserData.email; // Email có thể lấy từ đây
                // Các trường khác như phone, address cần được lưu trữ riêng cho profile
            } catch(e) { console.error("Lỗi parse user profile:", e); }
        }


        populateForm(originalUserData);
        setFormReadOnly(true);

        if(editBtn) {
            editBtn.addEventListener('click', function() {
                setFormReadOnly(false);
                if(document.getElementById('profileFullName')) document.getElementById('profileFullName').focus();
            });
        }

        if(cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                populateForm(originalUserData);
                setFormReadOnly(true);
            });
        }

        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
            editableFields.forEach(field => {
                if (field.value.trim() === '' && !field.readOnly) {
                    alert(`Vui lòng không để trống trường: ${field.previousElementSibling?.textContent?.replace(':', '') || field.name}`);
                    field.focus();
                    isValid = false;
                    return; // Dừng vòng lặp sớm nếu có lỗi
                }
            });

            if (isValid) {
                originalUserData.fullName = document.getElementById('profileFullName')?.value;
                originalUserData.phone = document.getElementById('profilePhone')?.value;
                originalUserData.address = document.getElementById('profileAddress')?.value;
                // Lưu originalUserData vào localStorage hoặc gửi lên server
                // localStorage.setItem('currentUserProfile', JSON.stringify(originalUserData));
                alert('Thông tin đã được cập nhật!');
                setFormReadOnly(true);
            }
        });

        editIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const fieldId = this.getAttribute('data-field');
                const inputField = document.getElementById(fieldId);
                if (inputField && inputField.readOnly) { // Chỉ kích hoạt sửa nếu đang ở chế độ readonly
                    setFormReadOnly(false);
                    inputField.focus();
                }
            });
        });
    }

    /**
     * Khởi tạo chức năng cho trang giỏ hàng
     */
    function initCartPage() {
        const cartWithItemsDiv = document.getElementById('cartWithItems');
        const cartEmptyDiv = document.getElementById('cartEmpty');

        if (!cartWithItemsDiv || !cartEmptyDiv) return;

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [
            // { id: 1, name: "Razer DeathAdder V2 Pro Wireless Gaming Mouse", price: 2990000, quantity: 1, image: "img/product-cart1-placeholder.jpg", sku: "RZ01-03350100" },
            // { id: 2, name: "Logitech G Pro X Mechanical Gaming Keyboard", price: 3500000, quantity: 1, image: "img/product-cart2-placeholder.jpg", sku: "LG-920-009239" }
        ]; // Lấy từ localStorage, nếu không có thì là mảng rỗng

        function renderCart() {
            if (cartItems.length === 0) {
                cartWithItemsDiv.style.display = 'none';
                cartEmptyDiv.style.display = 'block';
            } else {
                cartWithItemsDiv.style.display = 'flex';
                cartEmptyDiv.style.display = 'none';

                const tbody = cartWithItemsDiv.querySelector('.cart-items-list tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                let subtotal = 0;
                let itemCount = 0;

                cartItems.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    itemCount += item.quantity;

                    const tr = document.createElement('tr');
                    tr.classList.add('cart-item');
                    tr.dataset.itemId = item.id; // Thêm data-id để dễ dàng tìm item
                    tr.innerHTML = `
                        <td class="product-image-cell">
                            <a href="chitietsanpham.html?id=${item.id}"><img src="${item.image}" alt="${item.name}"></a>
                        </td>
                        <td class="product-name-cell">
                            <a href="chitietsanpham.html?id=${item.id}">${item.name}</a>
                            <p class="product-sku">SKU: ${item.sku || 'N/A'}</p>
                        </td>
                        <td class="product-price-cell">${formatCurrency(item.price)}</td>
                        <td class="product-quantity-cell">
                            <div class="quantity-selector cart-quantity">
                                <button type="button" class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                                <button type="button" class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                            </div>
                        </td>
                        <td class="product-subtotal-cell">${formatCurrency(itemTotal)}</td>
                        <td class="product-remove-cell">
                            <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                if(document.getElementById('cartItemCount')) document.getElementById('cartItemCount').textContent = itemCount;
                if(document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = formatCurrency(subtotal);
                if(document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = formatCurrency(subtotal);

                addCartEventListeners();
            }
        }

        function formatCurrency(amount) {
            return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }

        function updateQuantity(itemId, newQuantity) {
            const itemIndex = cartItems.findIndex(item => item.id == itemId);
            if (itemIndex > -1) {
                newQuantity = parseInt(newQuantity);
                if (newQuantity >= 1) {
                    cartItems[itemIndex].quantity = newQuantity;
                } else {
                     // Nếu số lượng < 1, có thể xóa item hoặc giữ lại là 1 tùy logic
                    cartItems.splice(itemIndex, 1); // Xóa item nếu số lượng < 1
                }
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCart();
                updateCartIconCount(); // Cập nhật số lượng trên icon giỏ hàng
            }
        }

        function removeItem(itemId) {
            cartItems = cartItems.filter(item => item.id != itemId);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCart();
            updateCartIconCount();
        }

        function addCartEventListeners() {
            const cartTable = document.querySelector('.cart-items-list table');
            if (!cartTable) return;

            cartTable.addEventListener('click', function(event) {
                const target = event.target;
                const cartItemRow = target.closest('.cart-item');
                if (!cartItemRow) return;

                const itemId = cartItemRow.dataset.itemId;
                const quantityInput = cartItemRow.querySelector('.quantity-input');

                if (target.classList.contains('minus-btn')) {
                    updateQuantity(itemId, parseInt(quantityInput.value) - 1);
                } else if (target.classList.contains('plus-btn')) {
                    updateQuantity(itemId, parseInt(quantityInput.value) + 1);
                } else if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
                    removeItem(itemId);
                }
            });

            // Sự kiện change cho input số lượng (nếu người dùng tự nhập)
            const quantityInputsInCart = document.querySelectorAll('.cart-quantity .quantity-input');
             quantityInputsInCart.forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = this.dataset.id;
                    updateQuantity(itemId, parseInt(this.value));
                });
            });
        }
        renderCart(); // Hiển thị giỏ hàng lần đầu
    }

    /**
     * Cập nhật số lượng sản phẩm trên icon giỏ hàng ở header
     */
    function updateCartIconCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalCount = 0;
        cartItems.forEach(item => {
            totalCount += item.quantity;
        });

        const cartCountElement = document.querySelector('.header-action-item .cart-count'); // Cần class .cart-count ở HTML
        const cartBtnHeader = document.getElementById('cartBtnHeader'); // Nút giỏ hàng chính

        if (cartBtnHeader) { // Kiểm tra nút giỏ hàng chính có tồn tại không
            let countSpan = cartBtnHeader.querySelector('.cart-count');
            if (!countSpan) { // Nếu chưa có span, tạo mới
                countSpan = document.createElement('span');
                countSpan.className = 'cart-count';
                // Chèn vào vị trí phù hợp, ví dụ sau chữ "Giỏ hàng"
                const cartTextSpan = cartBtnHeader.querySelector('span:not(.cart-count)');
                if (cartTextSpan) {
                    cartTextSpan.parentNode.insertBefore(countSpan, cartTextSpan.nextSibling);
                } else {
                     cartBtnHeader.appendChild(countSpan); // Hoặc chèn vào cuối nếu không có span chữ
                }
            }

            if (totalCount > 0) {
                countSpan.textContent = totalCount;
                countSpan.style.display = 'inline-block'; // Hoặc 'flex' tùy style
            } else {
                countSpan.style.display = 'none';
            }
        }
    }
    // Gọi hàm này khi trang tải và mỗi khi giỏ hàng thay đổi
    updateCartIconCount();


    /**
     * Khởi tạo chức năng cho trang lịch sử đơn hàng
     */
    function initOrderHistoryPage() {
        const orderListContainer = document.getElementById('orderList');
        const noOrdersMessageDiv = document.getElementById('noOrdersMessage');
        const orderPaginationDiv = document.getElementById('orderPagination');

        if (!orderListContainer || !noOrdersMessageDiv) return;

        const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [ // Lấy đơn hàng từ localStorage (ví dụ)
            // { id: "ZOO123456", date: "15/07/2023", status: "delivered", total: 6490000, itemsPreview: [{img: "img/product-cart1-placeholder.jpg"}, {img: "img/product-cart2-placeholder.jpg"}], itemCount: 3 },
            // { id: "ZOO654321", date: "10/07/2023", status: "shipped", total: 3290000, itemsPreview: [{img: "img/mouse1-placeholder.jpg"}], itemCount: 1 }
        ];

        function renderOrders(ordersToRender) {
            orderListContainer.innerHTML = '';

            if (ordersToRender.length === 0) {
                noOrdersMessageDiv.style.display = 'block';
                orderListContainer.style.display = 'none';
                if (orderPaginationDiv) orderPaginationDiv.style.display = 'none';
            } else {
                noOrdersMessageDiv.style.display = 'none';
                orderListContainer.style.display = 'flex';
                if (orderPaginationDiv) orderPaginationDiv.style.display = userOrders.length > 5 ? 'flex' : 'none';

                ordersToRender.forEach(order => {
                    const orderCard = document.createElement('div');
                    orderCard.classList.add('order-card');
                    let itemPreviewHTML = '';
                    if (order.itemsPreview && Array.isArray(order.itemsPreview)) {
                        order.itemsPreview.slice(0, 2).forEach(item => {
                            itemPreviewHTML += `<img src="${item.img}" alt="Sản phẩm">`;
                        });
                        if (order.itemCount > 2) {
                            itemPreviewHTML += `<span>+ ${order.itemCount - 2} sản phẩm khác</span>`;
                        }
                    }

                    orderCard.innerHTML = `
                        <div class="order-card-header">
                            <div class="order-id">Mã đơn hàng: <strong>#${order.id}</strong></div>
                            <div class="order-date">Ngày đặt: ${order.date}</div>
                            <div class="order-status status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${getStatusText(order.status)}</div>
                        </div>
                        <div class="order-card-body">
                            <div class="order-item-preview">${itemPreviewHTML}</div>
                            <div class="order-total">Tổng tiền: <strong>${formatCurrency(order.total)}</strong></div>
                        </div>
                        <div class="order-card-footer">
                            <a href="chitietdonhang.html?id=${order.id}" class="btn btn-view-detail">Xem chi tiết</a>
                        </div>
                    `;
                    orderListContainer.appendChild(orderCard);
                });
            }
        }

        function getStatusText(statusKey) {
            const statuses = {
                "pending": "Chờ xử lý", "processing": "Đang xử lý", "shipped": "Đang vận chuyển",
                "delivered": "Đã giao", "cancelled": "Đã hủy"
            };
            return statuses[statusKey.toLowerCase()] || statusKey;
        }

        function formatCurrency(amount) {
            return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }

        const statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value;
                const filteredOrders = selectedStatus === "all" ? userOrders : userOrders.filter(order => order.status === selectedStatus);
                renderOrders(filteredOrders);
            });
        }
        renderOrders(userOrders);
    }

});

// CSS Animations (giữ nguyên)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); max-height: 0; overflow: hidden; }
    to { opacity: 1; transform: translateY(0); max-height: 500px; overflow: hidden; }
}
@keyframes slideUp {
    from { opacity: 1; transform: translateY(0); max-height: 500px; overflow: hidden; }
    to { opacity: 0; transform: translateY(-20px); max-height: 0; overflow: hidden; }
}
.error { border-color: #e74c3c !important; animation: shake 0.5s ease-in-out; }
@keyframes shake {
    0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }
}
.user-avatar-header { position: relative; display: flex; align-items: center; cursor: pointer; }
.user-avatar-header img { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #ddd; object-fit: cover; }
.user-dropdown-menu {
    position: absolute; top: 100%; right: 0; background-color: #fff;
    border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    list-style: none; padding: 5px 0; margin: 5px 0 0 0; min-width: 180px; z-index: 1001;
    display: none; /* Ẩn ban đầu */
}
.user-dropdown-menu.show { display: block; animation: fadeIn 0.2s ease-out; }
.user-dropdown-menu li a {
    display: block; padding: 10px 15px; font-size: 14px; color: #333;
    text-decoration: none; white-space: nowrap;
}
.user-dropdown-menu li a:hover { background-color: #f5f5f5; color: #28B4B6; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(styleSheet);
