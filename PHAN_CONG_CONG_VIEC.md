# PHÂN CÔNG CÔNG VIỆC - EVDMS PROJECT

## Thông Tin Dự Án
- Tên dự án: Electric Vehicle Dealer Management System (EVDMS)
- Số thành viên: 5 người
- Công nghệ: Java Spring Boot, MySQL, HTML/CSS/JavaScript

## Phân Công Theo Thành Viên

### 1. Trần Hữu Lợi (Team Leader)
Vai trò: Backend Developer & Project Manager

Nhiệm vụ:
- Quản lý dự án, điều phối công việc nhóm
- Thiết kế kiến trúc hệ thống (Multi-module Maven)
- Cấu hình Spring Boot, Spring Security
- Module Common (Shared entities & utilities)
- API Authentication & Authorization
- Database design & migration scripts
- User Management & Session handling
- Dealer Management core functions
- Integration testing & API documentation

Files phụ trách:
- `modules/common-module/` (toàn bộ)
- `modules/dealer-module/src/main/java/com/evdms/evm/controller/`
  - AuthController.java
  - SessionAuthController.java
  - UserController.java
  - DealerWebController.java
- `modules/dealer-module/src/main/java/com/evdms/evm/model/`
  - User.java
  - Dealer.java
- `modules/dealer-module/src/main/java/com/evdms/evm/service/`
  - AuthService.java
  - UserService.java
- `modules/dealer-module/src/main/java/com/evdms/evm/config/`
  - SecurityConfig.java
  - WebConfig.java
- `modules/evm-module/src/main/java/com/evdms/evm/controller/`
  - DealerManagementController.java
  - DealerContractController.java
- `modules/evm-module/src/main/java/com/evdms/evm/service/`
  - DealerManagementService.java
  - DealerContractService.java
- `modules/evm-module/src/main/java/com/evdms/evm/model/`
  - DealerContract.java
- `db/COMPLETE_DATABASE_SETUP.sql`
- `db/ev_dealer_management_db.sql`
- `pom.xml` (root & all modules)

---

### 2. Lương Quốc An
Vai trò: Backend Developer

Nhiệm vụ:
- Module Dealer (Dealer Operations)
- Controllers: Customer, Vehicle, Sales Order, Inventory
- Services: Business logic cho dealer operations
- Repository layer cho các entities chính
- API endpoints cho frontend integration
- Test Drive & Feedback system
- Vehicle Specification management
- EVM Inventory & Wholesale pricing

Files phụ trách:
- `modules/dealer-module/src/main/java/com/evdms/evm/controller/`
  - CustomerController.java
  - VehicleController.java
  - SalesOrderController.java
  - OrderItemController.java
  - InventoryController.java
  - TestDriveController.java
  - FeedbackController.java
  - VehicleSpecificationController.java
  - DealerPayableController.java
- `modules/dealer-module/src/main/java/com/evdms/evm/service/`
  - CustomerService.java
  - VehicleService.java
  - SalesOrderService.java
  - OrderItemService.java
  - VehicleSpecificationService.java
- `modules/dealer-module/src/main/java/com/evdms/evm/repository/`
  - CustomerRepository.java
  - VehicleRepository.java
  - SalesOrderRepository.java
  - OrderItemRepository.java
  - InventoryRepository.java
  - TestDriveRepository.java
  - FeedbackRepository.java
  - VehicleSpecificationRepository.java
  - DealerPayableRepository.java
- `modules/dealer-module/src/main/java/com/evdms/evm/model/`
  - Customer.java
  - Vehicle.java
  - SalesOrder.java
  - OrderItem.java
  - Inventory.java
  - TestDrive.java
  - Feedback.java
  - VehicleSpecification.java
  - DealerPayable.java
- `modules/evm-module/src/main/java/com/evdms/evm/controller/`
  - EvmInventoryController.java
  - WholesalePriceController.java
- `modules/evm-module/src/main/java/com/evdms/evm/service/`
  - EvmInventoryService.java
  - WholesalePriceService.java
- `modules/evm-module/src/main/java/com/evdms/evm/model/`
  - WholesalePrice.java

---

### 3. Huỳnh Đặng Hoàn Nguyên
Vai trò: Backend Developer

Nhiệm vụ:
- Customer Financing & Interaction system
- Inventory Transaction tracking
- EVM Payment & Dealer Allowance management
- Promotion & Discount policies
- DTO layer cho API responses
- Data validation & error handling

Files phụ trách:
- `modules/dealer-module/src/main/java/com/evdms/evm/controller/`
  - CustomerFinancingController.java
  - InventoryTransactionController.java
  - CustomerInteractionController.java
- `modules/dealer-module/src/main/java/com/evdms/evm/service/`
  - CustomerFinancingService.java
  - InventoryTransactionService.java
  - CustomerInteractionService.java
- `modules/dealer-module/src/main/java/com/evdms/evm/repository/`
  - CustomerFinancingRepository.java
  - InventoryTransactionRepository.java
  - CustomerInteractionRepository.java
  - DealerRepository.java
- `modules/dealer-module/src/main/java/com/evdms/evm/model/`
  - CustomerFinancing.java
  - InventoryTransaction.java
  - CustomerInteraction.java
- `modules/dealer-module/src/main/java/com/evdms/evm/dto/` (toàn bộ)
- `modules/evm-module/src/main/java/com/evdms/evm/controller/`
  - DealerPaymentController.java
  - DealerAllowanceController.java
  - PromotionController.java
  - DiscountPolicyController.java
- `modules/evm-module/src/main/java/com/evdms/evm/service/`
  - DealerPaymentService.java
  - DealerAllowanceService.java
  - PromotionService.java
  - DiscountPolicyService.java
- `modules/evm-module/src/main/java/com/evdms/evm/model/`
  - DealerPayment.java
  - DealerAllowance.java
  - Promotion.java
  - DiscountPolicy.java
---

### 4. Nguyễn Như Quỳnh
Vai trò: Frontend Developer & Backend Support

Nhiệm vụ:
- Giao diện người dùng chính
- Dashboard cho các roles (Admin, Dealer Manager)
- Pages: Customers, Vehicles, Sales Orders
- Authentication UI (Login, Register)
- Responsive design & UX
- CSS styling & layout
- EVM Dealer Target & Report backend support

Files phụ trách:
- `frontend/index.html`, `frontend/login.html`, `frontend/register.html`
- `frontend/assets/css/style.css`
- `frontend/css/style.css`
- `frontend/assets/js/`
  - auth.js
  - customers.js
  - vehicles.js
  - Salesorders.js
  - dashboard.js
  - evmdashboard.js
  - config.js
  - main.js
  - utils.js
- `frontend/js/`
  - auth.js
  - config.js
  - dealers.js
  - reports.js
- `frontend/js/modules/`
  - customers.js
  - dashboard.js
  - evmdashboard.js
  - Salesorders.js
  - vehicles.js
  - utils.js
  - dealers.js
- `frontend/admin/` (toàn bộ)
- `frontend/dealer_manager/` (toàn bộ)
- `modules/evm-module/src/main/java/com/evdms/evm/controller/`
  - DealerTargetController.java
  - EvmReportController.java
  - ReportController.java
- `modules/evm-module/src/main/java/com/evdms/evm/service/`
  - DealerTargetService.java
  - EvmReportService.java
  - ReportService.java
- `modules/evm-module/src/main/java/com/evdms/evm/model/`
  - DealerTarget.java
- `modules/dealer-module/src/main/java/com/evdms/evm/controller/`
  - ReportController.java
- `modules/dealer-module/src/main/java/com/evdms/evm/service/`
  - ReportService.java
- `modules/dealer-module/src/main/java/com/evdms/evm/repository/`
  - ReportRepository.java
---

### 5. Trần Minh Phước
Vai trò: Frontend Developer

Nhiệm vụ:
- Advanced JavaScript modules
- Inventory & Transaction management UI
- Financial & Payment interfaces
- Test Drive booking system
- Feedback & Interaction pages
- Wholesale & Promotion features UI
- Dealer Staff & EVM Staff portals

Files phụ trách:
- `frontend/dealer_staff/` (toàn bộ)
- `frontend/evm_staff/` (toàn bộ)
- `frontend/pages/dashboard.html`
- `frontend/js/modules/`
  - inventory.js
  - inventorytransactions.js
  - financing.js
  - dealerpayments.js
  - testdrives.js
  - feedbacks.js
  - interactions.js
  - vehiclespecs.js
  - reports.js
  - promotions.js
  - wholesaleprices.js
- `frontend/assets/js/`
  - dealerpayments.js
  - financing.js
  - interactions.js
  - inventorytransactions.js
  - testdrives.js
  - feedbacks.js
  - vehiclespecs.js
---

## Tiến Độ Công Việc

Phase 1: Setup & Database (Hoàn thành)
- [x] Cấu trúc dự án multi-module
- [x] Database schema & migration scripts
- [x] Spring Boot configuration
- [x] Security setup

Phase 2: Backend Development (Đang thực hiện - 75%)
- [x] Common module entities
- [x] Dealer module controllers (hoàn thành 90%)
- [x] EVM module controllers (hoàn thành 80%)
- [x] Authentication API
- [ ] Business logic hoàn chỉnh cho tất cả services
- [ ] Repository queries tối ưu
- [ ] DTO mapping đầy đủ
- [ ] Report generation APIs

Phase 3: Frontend Development (Đang thực hiện - 60%)
- [x] Basic UI structure
- [x] Login/Register pages
- [x] Dashboard layouts
- [x] Customer & Vehicle pages (basic)
- [ ] EVM Staff portal hoàn chỉnh
- [ ] Dealer Staff portal hoàn chỉnh
- [ ] Advanced features (charts, analytics)
- [ ] UI/UX refinement & responsive design
- [ ] Form validation & error handling

Phase 4: Integration & Testing (Chưa bắt đầu - 0%)
- [ ] Frontend-Backend API integration
- [ ] End-to-end testing
- [ ] Unit tests cho services
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security testing
- [ ] Documentation

Phase 5: Deployment (Chưa bắt đầu - 0%)
- [ ] Production database setup
- [ ] Server configuration
- [ ] Environment variables setup
- [ ] Final testing
- [ ] Go-live preparation

Cập nhật lần cuối: 28/11/2025

