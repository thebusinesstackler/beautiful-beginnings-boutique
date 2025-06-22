
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: "Keepsake Ornaments",
      description: "Transform memories into beautiful ornaments",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/products/ornaments",
      featured: true
    },
    {
      name: "Memory Jewelry",
      description: "Wear your loved ones close to your heart",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      href: "/products/jewelry",
      featured: false
    },
    {
      name: "Slate Keepsakes",
      description: "Elegant slate pieces with lasting memories",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      href: "/products/slate",
      featured: false
    },
    {
      name: "Snow Globes",
      description: "Magical snow globes with your special moments",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      href: "/products/snow-globes",
      featured: false
    },
    {
      name: "Wood Art",
      description: "Rustic wood pieces with personalized touches",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      href: "/products/wood-subl

