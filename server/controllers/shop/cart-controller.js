

const supabase = require('../../config/supabase'); // Importamos el cliente de Supabase

// Añadir al carrito
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        // Verificar si el producto existe
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Buscar si el carrito ya existe para el usuario
        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();

        let cartId = null;
        if (cartError || !cart) {
            // Si no existe, crear un nuevo carrito
            const { data: cartInsert, error: cartInsertError } = await supabase
                .from('carts')
                .insert([{ user_id: userId }])
                .select('id')
                .single();

            if (cartInsertError) {
                return res.status(500).json({
                    success: false,
                    message: "Error creating cart"
                });
            }

            cartId = cartInsert.id;
        } else {
            cartId = cart.id;
        }

        // Verificar si el producto ya está en el carrito
        const { data: cartItem, error: cartItemError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cartId)
            .eq('product_id', productId)
            .single();

        if (cartItemError || !cartItem) {
            // Si no existe el producto, agregarlo al carrito
            const { error: insertError } = await supabase
                .from('cart_items')
                .insert([{ cart_id: cartId, product_id: productId, quantity }]);

            if (insertError) {
                return res.status(500).json({
                    success: false,
                    message: "Error adding product to cart"
                });
            }
        } else {
            // Si el producto ya está en el carrito, actualizar la cantidad
            const { error: updateError } = await supabase
                .from('cart_items')
                .update({ quantity: cartItem.quantity + quantity })
                .eq('cart_id', cartId)
                .eq('product_id', productId);

            if (updateError) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating cart item"
                });
            }
        }

        // Obtener los productos del carrito con la información completa
        const { data: cartItems, error: cartItemsError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(image, title, price, salePrice)')
            .eq('cart_id', cartId);

        if (cartItemsError) {
            return res.status(500).json({
                success: false,
                message: "Error fetching cart items"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                cartId,
                items: cartItems
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};


////



const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is mandatory"
            });
        }

        // Obtener el carrito del usuario
        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (cartError || !cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartId = cart.id;

        // Obtener los productos del carrito
        const { data: cartItems, error: cartItemsError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(image, title, price, salePrice)')
            .eq('cart_id', cartId);

        if (cartItemsError) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve cart items"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                cartId,
                items: cartItems
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};

/////


const updateCartQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (cartError || !cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartId = cart.id;

        const { data: cartItem, error: cartItemError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cartId)
            .eq('product_id', productId)
            .single();

        if (cartItemError || !cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not present"
            });
        }

        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('cart_id', cartId)
            .eq('product_id', productId);

        if (updateError) {
            return res.status(500).json({
                success: false,
                message: "Failed to update cart item"
            });
        }

        const { data: updatedCartItems, error: updatedCartItemsError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(image, title, price, salePrice)')
            .eq('cart_id', cartId);

        if (updatedCartItemsError) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve updated cart items"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                cartId,
                items: updatedCartItems
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};



/////

const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (cartError || !cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const cartId = cart.id;

        const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartId)
            .eq('product_id', productId);

        if (deleteError) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete cart item"
            });
        }

        const { data: updatedCartItems, error: updatedCartItemsError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(image, title, price, salePrice)')
            .eq('cart_id', cartId);

        if (updatedCartItemsError) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve updated cart items"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                cartId,
                items: updatedCartItems
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};


// Otras funciones (fetchCartItems, updateCartQuantity, deleteCartItem) también deben actualizarse de manera similar

module.exports = {
    addToCart,
    fetchCartItems,
    updateCartQuantity,
    deleteCartItem
};
