/**
 * PHUBA - Main JavaScript File
 * Xử lý tất cả các tương tác người dùng và chức năng động
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initPasswordToggle();
    initMobileMenu();
    initDateInputs();
    initFormValidation();
    initProductTabs(); // Thêm hàm này
    setCurrentYear(); // Thêm hàm này
    handleResponsive();
    
    // Lắng nghe sự kiện resize cửa sổ
    window.addEventListener('resize', handleResponsive);
    
    // ===== CÁC HÀM KHỞI TẠO =====
    
    /**
     * Khởi tạo chức năng hiển thị/ẩn mật khẩu
     */
    function initPasswordToggle() {
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');
        
        if (!togglePasswordButtons.length) return;
        
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Chuyển đổi biểu tượng mắt
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    }
    
    /**
     * Khởi tạo menu cho thiết bị di động
     */
    function initMobileMenu() {
        // Tạo nút toggle menu
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        const mainMenu = document.querySelector('.main-menu nav');
        if (!mainMenu) return;
        
        const mainMenuParent = mainMenu.parentElement;
        mainMenuParent.insertBefore(menuToggle, mainMenu);
        
        // Xử lý sự kiện click vào nút toggle
        menuToggle.addEventListener('click', function() {
            // Toggle class active cho menu
            mainMenu.classList.toggle('active');
            
            // Chuyển đổi biểu tượng
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Thêm hiệu ứng
            if (mainMenu.classList.contains('active')) {
                mainMenu.style.animation = 'slideDown 0.3s ease forwards';
            } else {
                mainMenu.style.animation = 'slideUp 0.3s ease forwards';
            }
        });
    }
    
    /**
     * Khởi tạo giá trị mặc định cho input date
     */
    function initDateInputs() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        if (!dateInputs.length) return;
        
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        
        // Thêm số 0 phía trước nếu cần
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        const formattedDate = `${year}-${month}-${day}`;
        
        dateInputs.forEach(input => {
            // Đặt giá trị tối thiểu là ngày hôm nay
            input.setAttribute('min', formattedDate);
            
            // Đặt giá trị mặc định nếu chưa có
            if (!input.value) {
                input.value = formattedDate;
            }
        });
    }
    
    /**
     * Khởi tạo kiểm tra hợp lệ cho form
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        if (!forms.length) return;
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                let isValid = true;
                
                // Kiểm tra các trường bắt buộc
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Thêm thông báo lỗi
                        showFieldError(field, 'Vui lòng điền thông tin này');
                    } else {
                        field.classList.remove('error');
                        removeFieldError(field);
                    }
                });
                
                // Kiểm tra xác nhận mật khẩu
                const password = form.querySelector('#password');
                const confirmPassword = form.querySelector('#confirm-password');
                if (password && confirmPassword) {
                    if (password.value !== confirmPassword.value) {
                        isValid = false;
                        confirmPassword.classList.add('error');
                        showFieldError(confirmPassword, 'Mật khẩu xác nhận không khớp');
                    }
                }
                
                // Kiểm tra email hợp lệ
                const emailField = form.querySelector('input[type="email"]');
                if (emailField && emailField.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailField.value)) {
                        isValid = false;
                        emailField.classList.add('error');
                        showFieldError(emailField, 'Email không hợp lệ');
                    }
                }
                
                if (!isValid) {
                    event.preventDefault();
                }
            });
            
            // Xóa lỗi khi người dùng nhập lại
            const inputFields = form.querySelectorAll('input, select, textarea');
            inputFields.forEach(field => {
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    removeFieldError(this);
                });
            });
        });
    }
    
    /**
     * Hiển thị thông báo lỗi cho trường input
     */
    function showFieldError(field, message) {
        // Xóa thông báo lỗi cũ nếu có
        removeFieldError(field);
        
        // Tạo thông báo lỗi mới
        const errorMessage = document.createElement('div');
        errorMessage.className = 'field-error';
        errorMessage.textContent = message;
        errorMessage.style.color = '#e74c3c';
        errorMessage.style.fontSize = '0.8em';
        errorMessage.style.marginTop = '5px';
        
        // Chèn thông báo lỗi sau trường input
        field.parentNode.appendChild(errorMessage);
    }
    
    /**
     * Xóa thông báo lỗi của trường input
     */
    function removeFieldError(field) {
        const errorMessage = field.parentNode.querySelector('.field-error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Khởi tạo chức năng lọc sản phẩm theo tab
     */
    function initProductTabs() {
        const tabs = document.querySelectorAll('.product-categories-tabs .tab-item');
        const productItems = document.querySelectorAll('.products-grid .product-item');

        if (!tabs.length || !productItems.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Xóa class active khỏi tất cả các tab
                tabs.forEach(t => t.classList.remove('active'));
                // Thêm class active cho tab được click
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-category');

                productItems.forEach(item => {
                    const itemCategories = item.getAttribute('data-category-item');
                    if (selectedCategory === 'all' || (itemCategories && itemCategories.includes(selectedCategory))) {
                        item.style.display = 'block'; // Hoặc 'grid', 'flex' tùy theo display của product-item
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
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
     * Xử lý responsive
     */
    function handleResponsive() {
        const windowWidth = window.innerWidth;
        const header = document.querySelector('header');
        
        if (!header) return;
        
        if (windowWidth <= 768) {
            // Chế độ mobile
            if (!header.classList.contains('mobile')) {
                header.classList.add('mobile');
            }
        } else {
            // Chế độ desktop
            header.classList.remove('mobile');
            
            // Reset menu khi chuyển sang desktop
            const mainMenu = document.querySelector('.main-menu nav');
            if (mainMenu) {
                mainMenu.classList.remove('active');
                mainMenu.style.animation = '';
            }
            
            // Reset icon menu toggle
            const menuToggle = document.querySelector('.menu-toggle i');
            if (menuToggle) {
                menuToggle.classList.remove('fa-times');
                menuToggle.classList.add('fa-bars');
            }
        }
    }
    
    /**
     * Thêm hiệu ứng cuộn mượt cho các liên kết trong trang
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Bỏ qua nếu là # hoặc không có target
                if (targetId === '#' || !targetId) return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Điều chỉnh offset cho header cố định
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Khởi tạo cuộn mượt
    initSmoothScroll();
});

/**
 * Thêm hiệu ứng CSS cho animations
 */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 500px; /* Đủ lớn để chứa menu */
    }
}

@keyframes slideUp {
    from {
        opacity: 1;
        transform: translateY(0);
        max-height: 500px;
    }
    to {
        opacity: 0;
        transform: translateY(-20px);
        max-height: 0;
    }
}

.error {
    border-color: #e74c3c !important;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
document.head.appendChild(styleSheet);
/**
 * PHUBA - Main JavaScript File
 * Xử lý tất cả các tương tác người dùng và chức năng động
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initPasswordToggle();
    initMobileMenu();
    initDateInputs();
    initFormValidation();
    initProductTabs();
    setCurrentYear();
    initProductImageGallery(); // Thêm hàm này
    initDetailedInfoTabs();   // Thêm hàm này
    initQuantitySelector();   // Thêm hàm này
    handleResponsive();

    // Lắng nghe sự kiện resize cửa sổ
    window.addEventListener('resize', handleResponsive);

    // ===== CÁC HÀM KHỞI TẠO =====

    // ... (Các hàm initPasswordToggle, initMobileMenu, initDateInputs, initFormValidation, initProductTabs, setCurrentYear, handleResponsive, initSmoothScroll đã có) ...

    /**
     * Khởi tạo gallery ảnh sản phẩm
     */
    function initProductImageGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail-item');

        if (!mainImage || !thumbnails.length) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Cập nhật ảnh chính
                mainImage.src = this.getAttribute('data-image');
                mainImage.alt = this.alt.replace('Thumbnail', 'Ảnh chính'); // Cập nhật alt text

                // Xóa class active khỏi tất cả thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                // Thêm class active cho thumbnail được click
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

                // Xóa class active khỏi tất cả tab link và tab pane
                tabLinks.forEach(l => l.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Thêm class active cho tab link và tab pane được chọn
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
        const quantityInputs = document.querySelectorAll('.quantity-input');

        quantityInputs.forEach(input => {
            const minusBtn = input.previousElementSibling;
            const plusBtn = input.nextElementSibling;

            if (minusBtn && minusBtn.classList.contains('minus-btn')) {
                minusBtn.addEventListener('click', function() {
                    let currentValue = parseInt(input.value);
                    if (currentValue > parseInt(input.min || 1)) {
                        input.value = currentValue - 1;
                    }
                });
            }

            if (plusBtn && plusBtn.classList.contains('plus-btn')) {
                plusBtn.addEventListener('click', function() {
                    let currentValue = parseInt(input.value);
                    input.value = currentValue + 1;
                });
            }
        });
    }
});

// ... (Phần styleSheet animation giữ nguyên) ...
/**
 * The Zoo Shop - Main JavaScript File
 * Xử lý tất cả các tương tác người dùng và chức năng động
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initMobileMenu();
    // initDateInputs(); // Có thể không cần cho trang auth
    initPasswordToggleVisibility(); // Đổi tên hàm
    initAuthFormValidation(); // Hàm validation mới
    // initProductTabs(); // Không cần cho trang auth
    setCurrentYear();
    // initProductImageGallery(); // Không cần cho trang auth
    // initDetailedInfoTabs();   // Không cần cho trang auth
    // initQuantitySelector();   // Không cần cho trang auth
    handleResponsive();

    window.addEventListener('resize', handleResponsive);

    // ===== CÁC HÀM KHỞI TẠO =====

    function initMobileMenu() {
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        const mainMenu = document.querySelector('.main-menu nav');
        if (!mainMenu) return;
        
        const mainMenuParent = mainMenu.parentElement;
        mainMenuParent.insertBefore(menuToggle, mainMenu);
        
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            if (mainMenu.classList.contains('active')) {
                mainMenu.style.animation = 'slideDown 0.3s ease forwards';
            } else {
                mainMenu.style.animation = 'slideUp 0.3s ease forwards';
            }
        });
    }

    /**
     * Khởi tạo chức năng hiển thị/ẩn mật khẩu
     */
    function initPasswordToggleVisibility() {
        const toggleButtons = document.querySelectorAll('.toggle-password-visibility');
        if (!toggleButtons.length) return;

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                if (passwordInput && (passwordInput.type === 'password' || passwordInput.type === 'text')) {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);

                    const icon = this.querySelector('i');
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        });
    }


    function setCurrentYear() {
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    function handleResponsive() {
        const windowWidth = window.innerWidth;
        const header = document.querySelector('header');
        if (!header) return;
        if (windowWidth <= 768) {
            if (!header.classList.contains('mobile')) {
                header.classList.add('mobile');
            }
        } else {
            header.classList.remove('mobile');
            const mainMenu = document.querySelector('.main-menu nav');
            if (mainMenu) {
                mainMenu.classList.remove('active');
                mainMenu.style.animation = '';
            }
            const menuToggleIcon = document.querySelector('.menu-toggle i');
            if (menuToggleIcon) {
                menuToggleIcon.classList.remove('fa-times');
                menuToggleIcon.classList.add('fa-bars');
            }
        }
    }

    /**
     * Khởi tạo kiểm tra hợp lệ cho form Đăng nhập và Đăng ký
     */
    function initAuthFormValidation() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                }
            });
            addInputListeners(loginForm);
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                }
            });
            addInputListeners(registerForm);
        }
    }

    function addInputListeners(form) {
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this); // Validate khi người dùng nhập
            });
            input.addEventListener('blur', function() {
                validateField(this); // Validate khi người dùng rời khỏi trường
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function validateField(input) {
        const errorMessageElement = input.closest('.form-group').querySelector('.form-error-message');
        let message = '';
        let fieldValid = true;

        // Kiểm tra rỗng
        if (input.value.trim() === '') {
            message = 'Vui lòng không để trống trường này.';
            fieldValid = false;
        }
        // Kiểm tra email (nếu là trường email)
        else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                message = 'Địa chỉ email không hợp lệ.';
                fieldValid = false;
            }
        }
        // Kiểm tra độ dài tối thiểu mật khẩu (nếu là trường mật khẩu và có minlength)
        else if (input.type === 'password' && input.hasAttribute('minlength')) {
            if (input.value.length < parseInt(input.getAttribute('minlength'))) {
                message = `Mật khẩu phải có ít nhất ${input.getAttribute('minlength')} ký tự.`;
                fieldValid = false;
            }
        }
        // Kiểm tra xác nhận mật khẩu
        else if (input.id === 'registerConfirmPassword') {
            const passwordInput = document.getElementById('registerPassword');
            if (passwordInput && input.value !== passwordInput.value) {
                message = 'Mật khẩu xác nhận không khớp.';
                fieldValid = false;
            }
        }
        // Kiểm tra checkbox điều khoản
        else if (input.type === 'checkbox' && input.id === 'agreeTerms') {
            if (!input.checked) {
                message = 'Bạn phải đồng ý với điều khoản dịch vụ.';
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

});

// ... (Phần styleSheet animation giữ nguyên từ trước) ...
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 500px; }
}
@keyframes slideUp {
    from { opacity: 1; transform: translateY(0); max-height: 500px; }
    to { opacity: 0; transform: translateY(-20px); max-height: 0; }
}
.error { border-color: #e74c3c !important; animation: shake 0.5s ease-in-out; }
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
document.head.appendChild(styleSheet);
/**
 * The Zoo Shop - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initMobileMenu();
    initPasswordToggleVisibility();
    initAuthFormValidation();
    setCurrentYear();
    initProductImageGallery();
    initDetailedInfoTabs();
    initQuantitySelector();
    updateHeaderBasedOnLogin(); // Hàm mới
    initDiscountCodeToggle(); // Hàm mới
    handleResponsive();

    window.addEventListener('resize', handleResponsive);

    // ===== CÁC HÀM KHỞI TẠO =====

    // ... (Các hàm initMobileMenu, initPasswordToggleVisibility, initAuthFormValidation, setCurrentYear, initProductImageGallery, initDetailedInfoTabs, initQuantitySelector, handleResponsive đã có) ...


    /**
     * Cập nhật Header dựa trên trạng thái đăng nhập
     * Giả sử trạng thái đăng nhập được lưu trong localStorage
     */
    function updateHeaderBasedOnLogin() {
        const loginBtnHeader = document.getElementById('loginBtnHeader');
        const userAvatarHeader = document.getElementById('userAvatarHeader');
        const headerUserAvatarImg = document.getElementById('headerUserAvatarImg');
        const logoutBtnHeader = document.getElementById('logoutBtnHeader');

        if (!loginBtnHeader || !userAvatarHeader || !headerUserAvatarImg || !logoutBtnHeader) return;

        // Giả sử: kiểm tra localStorage xem có 'loggedInUser' không
        const loggedInUser = localStorage.getItem('loggedInUser'); // Ví dụ: lưu tên người dùng hoặc token

        if (loggedInUser) {
            // Đã đăng nhập
            loginBtnHeader.style.display = 'none';
            userAvatarHeader.style.display = 'flex'; // Hiển thị avatar
            // headerUserAvatarImg.src = "đường_dẫn_tới_avatar_thật.jpg"; // Cập nhật avatar thật
            // Thêm sự kiện click cho avatar để hiện dropdown (nếu cần)
            userAvatarHeader.addEventListener('click', function(e) {
                e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                const dropdown = this.querySelector('.user-dropdown-menu');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });

            logoutBtnHeader.addEventListener('click', function(e) {
                e.preventDefault();
                // Xử lý đăng xuất: xóa localStorage, chuyển hướng, ...
                localStorage.removeItem('loggedInUser');
                alert('Đã đăng xuất!');
                window.location.reload(); // Tải lại trang để cập nhật header
            });

        } else {
            // Chưa đăng nhập
            loginBtnHeader.style.display = 'flex';
            userAvatarHeader.style.display = 'none';
        }
    }
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function() {
        const openDropdown = document.querySelector('.user-dropdown-menu.show');
        if (openDropdown) {
            openDropdown.classList.remove('show');
        }
    });


    /**
     * Khởi tạo chức năng hiển thị/ẩn ô nhập mã giảm giá
     */
    function initDiscountCodeToggle() {
        const showDiscountBtn = document.getElementById('showDiscountCode');
        const discountInputWrapper = document.querySelector('.discount-code-input-wrapper');

        if (!showDiscountBtn || !discountInputWrapper) return;

        showDiscountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (discountInputWrapper.style.display === 'none' || discountInputWrapper.style.display === '') {
                discountInputWrapper.style.display = 'flex';
                this.classList.add('open'); // Thêm class để xoay icon nếu cần
            } else {
                discountInputWrapper.style.display = 'none';
                this.classList.remove('open');
            }
        });
    }

});

// ... (Phần styleSheet animation giữ nguyên từ trước) ...
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 500px; }
}
@keyframes slideUp {
    from { opacity: 1; transform: translateY(0); max-height: 500px; }
    to { opacity: 0; transform: translateY(-20px); max-height: 0; }
}
.error { border-color: #e74c3c !important; animation: shake 0.5s ease-in-out; }
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* CSS cho user dropdown menu */
.user-avatar-header {
    position: relative;
    display: flex; /* Sẽ được JS đổi thành flex khi đăng nhập */
    align-items: center;
    cursor: pointer;
}
.user-avatar-header img {
    width: 32px; /* Kích thước avatar */
    height: 32px;
    border-radius: 50%;
    border: 1px solid #ddd;
    object-fit: cover;
}
.user-dropdown-menu {
    position: absolute;
    top: 100%; /* Ngay dưới avatar */
    right: 0;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    list-style: none;
    padding: 5px 0;
    margin: 5px 0 0 0; /* Khoảng cách nhỏ với avatar */
    min-width: 160px;
    z-index: 1001;
    display: none; /* Ẩn ban đầu */
}
.user-dropdown-menu.show {
    display: block;
    animation: fadeIn 0.2s ease-out;
}
.user-dropdown-menu li a {
    display: block;
    padding: 8px 15px;
    font-size: 14px;
    color: #333;
    text-decoration: none;
    white-space: nowrap;
}
.user-dropdown-menu li a:hover {
    background-color: #f5f5f5;
    color: #28B4B6; /* MÀU: Xanh ngọc */
}
`;
document.head.appendChild(styleSheet);
/**
 * The Zoo Shop - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== KHỞI TẠO CÁC THÀNH PHẦN =====
    initMobileMenu();
    initPasswordToggleVisibility();
    initAuthFormValidation();
    setCurrentYear();
    initProductImageGallery();
    initDetailedInfoTabs();
    initQuantitySelector();
    updateHeaderBasedOnLogin();
    initDiscountCodeToggle();
    initUserProfileForm();
    initCartPage();
    initOrderHistoryPage(); // Hàm mới
    handleResponsive();

    window.addEventListener('resize', handleResponsive);

    // ===== CÁC HÀM KHỞI TẠO =====

    // ... (Các hàm khác đã có) ...

    /**
     * Khởi tạo chức năng cho trang lịch sử đơn hàng
     */
    function initOrderHistoryPage() {
        const orderListContainer = document.getElementById('orderList');
        const noOrdersMessageDiv = document.getElementById('noOrdersMessage');
        const orderPaginationDiv = document.getElementById('orderPagination'); // Giả sử có phân trang

        if (!orderListContainer || !noOrdersMessageDiv) return; // Chỉ chạy nếu đang ở trang đơn hàng

        // Giả sử danh sách đơn hàng được lấy từ API hoặc localStorage
        // Dữ liệu mẫu:
        const userOrders = [
            { id: "ZOO123456", date: "15/07/2023", status: "delivered", total: 6490000, itemsPreview: [{img: "img/product-cart1-placeholder.jpg"}, {img: "img/product-cart2-placeholder.jpg"}], itemCount: 3 },
            { id: "ZOO654321", date: "10/07/2023", status: "shipped", total: 3290000, itemsPreview: [{img: "img/mouse1-placeholder.jpg"}], itemCount: 1 },
            { id: "ZOO789012", date: "05/07/2023", status: "cancelled", total: 500000, itemsPreview: [{img: "img/arduino_uno_main.jpg"}], itemCount: 1 }
        ];
        // const userOrders = []; // Test trường hợp không có đơn hàng

        function renderOrders(ordersToRender) {
            orderListContainer.innerHTML = ''; // Xóa các đơn hàng cũ

            if (ordersToRender.length === 0) {
                noOrdersMessageDiv.style.display = 'block';
                orderListContainer.style.display = 'none';
                if (orderPaginationDiv) orderPaginationDiv.style.display = 'none';
            } else {
                noOrdersMessageDiv.style.display = 'none';
                orderListContainer.style.display = 'flex'; // Hoặc 'block'
                if (orderPaginationDiv) orderPaginationDiv.style.display = userOrders.length > 5 ? 'flex' : 'none'; // Hiển thị phân trang nếu nhiều đơn

                ordersToRender.forEach(order => {
                    const orderCard = document.createElement('div');
                    orderCard.classList.add('order-card');

                    let itemPreviewHTML = '';
                    order.itemsPreview.slice(0, 2).forEach(item => { // Hiển thị tối đa 2 ảnh preview
                        itemPreviewHTML += `<img src="${item.img}" alt="Sản phẩm">`;
                    });
                    if (order.itemCount > 2) {
                        itemPreviewHTML += `<span>+ ${order.itemCount - 2} sản phẩm khác</span>`;
                    } else if (order.itemCount === 0 && order.itemsPreview.length > 0) {
                        // Trường hợp đặc biệt nếu itemCount không đúng nhưng có preview
                         itemPreviewHTML += `<span>Xem chi tiết</span>`;
                    }


                    orderCard.innerHTML = `
                        <div class="order-card-header">
                            <div class="order-id">Mã đơn hàng: <strong>#${order.id}</strong></div>
                            <div class="order-date">Ngày đặt: ${order.date}</div>
                            <div class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">${getStatusText(order.status)}</div>
                        </div>
                        <div class="order-card-body">
                            <div class="order-item-preview">
                                ${itemPreviewHTML}
                            </div>
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
                "pending": "Chờ xử lý",
                "processing": "Đang xử lý",
                "shipped": "Đang vận chuyển",
                "delivered": "Đã giao",
                "cancelled": "Đã hủy"
            };
            return statuses[statusKey.toLowerCase()] || statusKey;
        }

        function formatCurrency(amount) {
            return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }

        // Lọc đơn hàng
        const statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value;
                if (selectedStatus === "all") {
                    renderOrders(userOrders);
                } else {
                    const filteredOrders = userOrders.filter(order => order.status === selectedStatus);
                    renderOrders(filteredOrders);
                }
            });
        }

        // Hiển thị đơn hàng lần đầu
        renderOrders(userOrders);
    }

});

// ... (Phần styleSheet animation giữ nguyên từ trước) ...
