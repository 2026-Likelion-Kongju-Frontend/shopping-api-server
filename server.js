const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

let products = [
    { id: 1, image: "/images/product-1.png", brand: "하하브랜드", name: "버블 블라우스", originalPrice: 34000, discountRate: 0, price: 34000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-1.png" },
    { id: 2, image: "/images/product-2.png", brand: "키키브랜드", name: "그물 니트 가디건", originalPrice: 37000, discountRate: 23, price: 28400, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-2.png" },
    { id: 3, image: "/images/product-3.png", brand: "야야브랜드", name: "키치 라운드티", originalPrice: 17900, discountRate: 0, price: 17900, isLiked: true, sizes: ["S", "M", "L"], descriptionImage: "/images/product-3.png" },
    { id: 4, image: "/images/product-4.png", brand: "호호브랜드", name: "카라 블라우스", originalPrice: 34000, discountRate: 30, price: 23800, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-4.png" },
    { id: 5, image: "/images/product-5.png", brand: "마마브랜드", name: "쉬폰 블라우스", originalPrice: 50660, discountRate: 0, price: 50660, isLiked: true, sizes: ["S", "M", "L"], descriptionImage: "/images/product-5.png" },
    { id: 6, image: "/images/product-6.png", brand: "히히브랜드", name: "여성 브이넥", originalPrice: 23400, discountRate: 18, price: 19200, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-6.png" },
    { id: 7, image: "/images/product-7.png", brand: "모모브랜드", name: "체크 스커트", originalPrice: 37500, discountRate: 20, price: 30000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-7.png" },
    { id: 8, image: "/images/product-8.png", brand: "남남브랜드", name: "니시 니트", originalPrice: 43600, discountRate: 0, price: 43600, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-8.png" },
    { id: 9, image: "/images/product-9.png", brand: "오오브랜드", name: "여름 민소매", originalPrice: 22000, discountRate: 0, price: 22000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-9.png" },
    { id: 10, image: "/images/product-10.png", brand: "유유브랜드", name: "프린팅 반팔티", originalPrice: 29000, discountRate: 10, price: 26000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-10.png" },
    { id: 11, image: "/images/product-11.png", brand: "비비브랜드", name: "여성 트레이닝", originalPrice: 41000, discountRate: 0, price: 41000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-11.png" },
    { id: 12, image: "/images/product-12.png", brand: "뷰뷰브랜드", name: "데님 원피스", originalPrice: 56400, discountRate: 15, price: 48000, isLiked: false, sizes: ["S", "M", "L"], descriptionImage: "/images/product-12.png" },
];

let cartItems = [];

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Shopping Mall API",
        version: "1.0.0",
        description: "프론트 교육용 쇼핑몰 API 명세서",
    },
    servers: [
        {
            url: "https://shopping-api-server.onrender.com",
        },
    ],
    tags: [
        { name: "Products", description: "상품 관련 API" },
        { name: "Cart", description: "장바구니 관련 API" },
    ],
    paths: {
        "/products": {
            get: {
                summary: "상품 목록 조회",
                description: "홈 화면에서 보여줄 전체 상품 목록을 조회합니다.",
                tags: ["Products"],
                responses: {
                    200: {
                        description: "상품 목록 조회 성공",
                    },
                },
            },
        },
        "/products/{productId}": {
            get: {
                summary: "상품 상세 조회",
                description: "상품 ID에 해당하는 상세 정보를 조회합니다.",
                tags: ["Products"],
                parameters: [
                    {
                        name: "productId",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "상품 ID",
                        example: 1,
                    },
                ],
                responses: {
                    200: { description: "상품 상세 조회 성공" },
                    404: { description: "상품을 찾을 수 없음" },
                },
            },
        },
        "/products/{productId}/like": {
            patch: {
                summary: "상품 좋아요 토글",
                description: "상품의 좋아요 상태를 true/false로 변경합니다. 홈과 상세가 같은 데이터를 사용하므로 연동됩니다.",
                tags: ["Products"],
                parameters: [
                    {
                        name: "productId",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "상품 ID",
                        example: 1,
                    },
                ],
                responses: {
                    200: { description: "좋아요 변경 성공" },
                    404: { description: "상품을 찾을 수 없음" },
                },
            },
        },
        "/cart/items": {
            get: {
                summary: "장바구니 조회",
                description: "현재 장바구니에 담긴 상품 목록을 조회합니다.",
                tags: ["Cart"],
                responses: {
                    200: { description: "장바구니 조회 성공" },
                },
            },
            post: {
                summary: "장바구니 담기",
                description: "상품 상세에서 선택한 사이즈와 수량을 장바구니에 담습니다.",
                tags: ["Cart"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["productId", "size", "quantity"],
                                properties: {
                                    productId: { type: "integer", example: 1 },
                                    size: { type: "string", example: "M" },
                                    quantity: { type: "integer", example: 2 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "장바구니 담기 성공" },
                    400: { description: "요청값 오류" },
                    404: { description: "상품을 찾을 수 없음" },
                },
            },
        },
    },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Shopping Mall API Server");
});

app.get("/products", (req, res) => {
    res.status(200).json({
        success: true,
        data: products,
    });
});

app.get("/products/:productId", (req, res) => {
    const productId = Number(req.params.productId);
    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "상품을 찾을 수 없습니다.",
        });
    }

    res.status(200).json({
        success: true,
        data: product,
    });
});

app.patch("/products/:productId/like", (req, res) => {
    const productId = Number(req.params.productId);
    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "상품을 찾을 수 없습니다.",
        });
    }

    product.isLiked = !product.isLiked;

    res.status(200).json({
        success: true,
        data: {
            productId: product.id,
            isLiked: product.isLiked,
        },
        message: product.isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.",
    });
});

app.post("/cart/items", (req, res) => {
    const { productId, size, quantity } = req.body;

    if (!productId || !size || !quantity) {
        return res.status(400).json({
            success: false,
            message: "productId, size, quantity는 필수입니다.",
        });
    }

    const product = products.find((item) => item.id === Number(productId));

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "상품을 찾을 수 없습니다.",
        });
    }

    if (!product.sizes.includes(size)) {
        return res.status(400).json({
            success: false,
            message: "선택할 수 없는 사이즈입니다.",
        });
    }

    if (quantity < 1) {
        return res.status(400).json({
            success: false,
            message: "수량은 1개 이상이어야 합니다.",
        });
    }

    const cartItem = {
        cartItemId: Date.now(),
        productId: product.id,
        image: product.image,
        brand: product.brand,
        name: product.name,
        size,
        quantity,
        price: product.price,
        totalPrice: product.price * quantity,
    };

    cartItems.push(cartItem);

    res.status(201).json({
        success: true,
        data: cartItem,
        message: "장바구니에 담겼습니다.",
    });
});

app.get("/cart/items", (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            items: cartItems,
            totalPrice: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
        },
    });
});

app.listen(PORT, () => {
    console.log(`API server running: http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});