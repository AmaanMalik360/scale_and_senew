# Admin Modal System

A reusable, accessible modal system for the admin panel built with Radix UI primitives.

## Components

### Base Modal (`Modal.tsx`)

A foundational modal wrapper component with the following features:

**Props:**
- `open: boolean` - Controls modal visibility
- `onOpenChange: (open: boolean) => void` - Callback when modal state changes
- `title: string` - Modal title
- `description?: string` - Optional description below title
- `children: ReactNode` - Modal content
- `size?: ModalSize` - Modal size variant (sm, md, lg, xl)
- `footer?: ReactNode` - Optional footer content (typically buttons)
- `showCloseButton?: boolean` - Show/hide close button (default: true)
- `closeOnOverlayClick?: boolean` - Allow closing by clicking overlay (default: true)

**Size Variants:**
- `sm` - max-w-md (448px)
- `md` - max-w-lg (512px) - default
- `lg` - max-w-2xl (672px)
- `xl` - max-w-4xl (896px)

**Features:**
- Smooth animations (fade + zoom)
- Backdrop blur effect
- Scroll lock when open
- Keyboard accessible (ESC to close)
- Focus trap
- Follows admin design system colors

### CategoryFormModal (`CategoryFormModal.tsx`)

A specialized modal for creating/editing categories with form validation.

**Props:**
- `open: boolean` - Controls modal visibility
- `onOpenChange: (open: boolean) => void` - Callback when modal state changes
- `onSubmit: (data: CategoryFormData) => void | Promise<void>` - Form submission handler
- `categories: Category[]` - All categories for parent selection
- `initialData?: Partial<CategoryFormData>` - Initial form values (for editing)
- `isLoading?: boolean` - Loading state
- `mode?: 'create' | 'edit'` - Form mode (default: 'create')
- `size?: ModalSize` - Modal size (default: 'md')

**Form Fields:**
- **Category Name** (required)
  - Min 2 characters, max 100 characters
  - Alphanumeric with spaces, hyphens, ampersands, apostrophes
  - Real-time validation with error messages
  
- **Parent Category** (optional)
  - Dropdown with hierarchical display
  - Shows category tree with indentation
  - "None" option for root categories

**Validation:**
- Uses Zod schema validation
- React Hook Form for form state management
- Field-level error messages
- Prevents submission with invalid data

**Features:**
- Auto-resets form on open/close
- Disables interactions during submission
- Hierarchical category display with indentation
- Accessible form controls with ARIA labels
- Error state indicators

## Usage Examples

### Basic Modal

```tsx
import { Modal } from "@/components/admin/modals";

const [isOpen, setIsOpen] = useState(false);

<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="sm"
  footer={
    <>
      <button onClick={() => setIsOpen(false)} className="admin-btn-secondary">
        Cancel
      </button>
      <button onClick={handleConfirm} className="admin-btn-primary">
        Confirm
      </button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### Category Form Modal

```tsx
import { CategoryFormModal } from "@/components/admin/modals";
import { useCreateCategoryMutation } from "@/state/categories-api";

const [isModalOpen, setIsModalOpen] = useState(false);
const [createCategory, { isLoading }] = useCreateCategoryMutation();

const handleSubmit = async (data) => {
  try {
    await createCategory(data).unwrap();
    setIsModalOpen(false);
  } catch (error) {
    console.error("Failed to create category:", error);
  }
};

<CategoryFormModal
  open={isModalOpen}
  onOpenChange={setIsModalOpen}
  onSubmit={handleSubmit}
  categories={allCategories}
  isLoading={isLoading}
  mode="create"
/>
```

### Edit Category

```tsx
<CategoryFormModal
  open={isEditModalOpen}
  onOpenChange={setIsEditModalOpen}
  onSubmit={handleUpdate}
  categories={allCategories}
  initialData={{
    name: selectedCategory.name,
    parent_id: selectedCategory.parent_id,
  }}
  isLoading={isUpdating}
  mode="edit"
/>
```

## Design System Integration

All modals follow the admin panel design system:

**Colors:**
- Brand Primary: `--admin-brand-primary` (#4EA674)
- Brand Secondary: `--admin-brand-secondary` (#023337)
- Accent: `--admin-accent` (#EAF8E7)
- Error: `--admin-error` (#EF4343)
- Grey: `--admin-grey` (#7C7C7C)

**Typography:**
- Title: `.text-title-lg` (22px, medium)
- Body: `.text-body-sm` (14px)
- Caption: `.text-caption` (12px)

**Spacing:**
- Padding: 24px (var(--admin-space-6))
- Border radius: 12px (var(--admin-radius-lg))
- Shadows: var(--admin-shadow-3), var(--admin-shadow-6)

## Accessibility

- Keyboard navigation (Tab, Shift+Tab, ESC)
- Focus management and trapping
- ARIA labels and descriptions
- Screen reader announcements
- Error announcements with `role="alert"`
- Semantic HTML structure

## Backend Integration

The category form integrates with the standardized API response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

All category endpoints now return this format for consistent error handling and success feedback.
