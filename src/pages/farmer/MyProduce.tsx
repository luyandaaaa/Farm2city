import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Package, 
  TrendingUp,
  AlertTriangle,
  Save,
  X
} from "lucide-react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import spinachImage from "@/assets/products/spinach.jpg";
import heritageImage from "@/assets/products/heritage-tomatoes.jpg";
import cornImage from "@/assets/products/sweet-corn.jpg";
import { saveFarmerProduct, getFarmerProducts, getUserProfile } from '@/lib/localStorageUtils';

export default function MyProduce() {
  const user = localStorage.getItem('farm2city_user');
  const [products, setProducts] = useState(() => {
    if (user) {
      return getFarmerProducts(user) || [];
    }
    return [];
  });

  // Helper to save product for both farmer and global products
  const saveProductForAll = (user, product) => {
    saveFarmerProduct(user, product);
    // Save to global products for consumers
    const allProducts = JSON.parse(localStorage.getItem('farm2city_products') || '[]');
    localStorage.setItem('farm2city_products', JSON.stringify([...allProducts, product]));
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    stock: "",
    description: "",
    image: null
  });

  useEffect(() => {
    if (user) {
      setProducts(getFarmerProducts(user) || []);
    }
  }, [user]);

  const handleAddProduct = () => {
    // Validate required fields
    if (!newProduct.name.trim() || !newProduct.category.trim() || !newProduct.price.toString().trim() || !newProduct.unit.trim() || !newProduct.stock.toString().trim() || !newProduct.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Handle image: convert to data URL for localStorage
    let imageUrl = spinachImage;
    if (newProduct.image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === "string") {
          imageUrl = e.target.result;
          addProductWithImage(imageUrl);
        } else {
          toast({
            title: "Error",
            description: "Image upload failed. Please try again.",
            variant: "destructive"
          });
        }
      };
      reader.readAsDataURL(newProduct.image);
      return; // Wait for async
    } else {
      addProductWithImage(imageUrl);
    }
  };

  const addProductWithImage = (imageUrl) => {
    let farmerProfile = {};
    if (user) {
      farmerProfile = getUserProfile(user) || {};
    }
    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) < 10 ? "low_stock" : "active",
      image: imageUrl,
      description: newProduct.description,
      farmerProfile
    };
    setProducts([...products, product]);
    if (user) saveProductForAll(user, product);
    setNewProduct({ name: "", category: "", price: "", unit: "", stock: "", description: "", image: null });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Product added successfully!",
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
  };

  const handleSaveEdit = (productId) => {
    setEditingProduct(null);
    toast({
      title: "Success", 
      description: "Product updated successfully!",
    });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Success",
      description: "Product deleted successfully!",
    });
  };

  const updateProduct = (productId, field, value) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  return (
    <FarmerLayout currentPage="My Produce">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Produce 🌱</h1>
            <p className="text-muted-foreground">
              Manage your crop listings and inventory
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Produce
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.filter(p => p.status === 'low_stock').length}</p>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-glow/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Stock (kg)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Product Form */}
        {showAddForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add New Produce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Organic Carrots"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    placeholder="e.g., Root Vegetables"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price per Unit</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input 
                    id="unit" 
                    placeholder="kg, bunch, dozen"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.files?.[0] || null})}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your produce, growing methods, harvest date..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Produce
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image || spinachImage} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={e => { e.currentTarget.src = spinachImage; }}
                    />
                    <div className="flex-1">
                      {editingProduct === product.id ? (
                        <div className="space-y-2">
                          <Input 
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            className="font-semibold"
                          />
                          <Input 
                            value={product.category}
                            onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Input 
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                              className="w-24"
                            />
                            <Input 
                              type="number"
                              value={product.stock}
                              onChange={(e) => updateProduct(product.id, 'stock', parseInt(e.target.value))}
                              className="w-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                              {product.status === 'active' ? 'Active' : 'Low Stock'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {product.stock} {product.unit} available
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {editingProduct !== product.id && (
                      <div className="text-right">
                        <p className="font-bold">R{product.price}</p>
                        <p className="text-sm text-muted-foreground">per {product.unit}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingProduct === product.id ? (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSaveEdit(product.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProduct(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
}