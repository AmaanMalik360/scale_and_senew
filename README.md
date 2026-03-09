# Shades and Sinew Jewelry - Frontend

A modern e-commerce jewelry store built with Next.js, TypeScript, and shadcn/ui components.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 🎨 UI Components (shadcn/ui)

This project uses shadcn/ui components for a consistent design system. The components are located in `src/components/ui/`.

### Available Components

- Button, Card, Input, Label
- Dialog, Dropdown Menu, Select
- Checkbox, Radio Group
- Accordion, Carousel, Textarea
- Sonner (Toast notifications)

### Adding New Components

To add new shadcn/ui components:

```bash
# Add a single component
pnpm dlx shadcn@latest add [component-name]

# Add multiple components
pnpm dlx shadcn@latest add button card input

# Examples
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add separator
```

### Component Usage

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (routes)/       # Route groups
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── header/        # Header components
│   ├── category/      # Category page components
│   ├── content/       # Content section components
│   ├── product/       # Product detail components
│   └── about/         # About page components
├── assets/            # Static assets (images)
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

## 🎯 Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Component Reusability**: Modular shadcn/ui components
- **Image Optimization**: Next.js Image component support
- **SEO Friendly**: Built-in Next.js SEO optimizations

## 🔧 Development

### Code Style

- Uses ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📦 Build & Deploy

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For other deployment options, check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [shadcn/ui Documentation](https://ui.shadcn.com) - Component library documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Icon library

## 📄 License

This project is licensed under the MIT License.
