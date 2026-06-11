// 1. Extract route parameters from a string literal type (e.g., "/user/:id/:post" -> "id" | "post")
type ExtractRouteParams<T extends string> =
    T extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/:${Rest}`>
    : T extends `${string}/:${infer Param}`
    ? Param
    : never;

// 2. Map the extracted parameters into an object of string values
type RouteParamsObject<Path extends string> = {
    [K in ExtractRouteParams<Path>]: string;
};

// 3. Define an unexpected, deeply nested recursive type to stretch compiler limits
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 4. Create a strongly-typed Mock Request Handler class using generic constraints
class TypedRouter<const TRoutes extends string[]> {
    private routes: TRoutes;

    constructor(routes: TRoutes) {
        this.routes = routes;
    }

    // Safely handles execution only if the path exactly matches a defined route
    public executeHandler<
        Path extends TRoutes[number],
        Params extends RouteParamsObject<Path>
    >(
        path: Path,
        params: DeepReadonly<Params>
    ): string {
        return `Successfully resolved path "${path}" with variables: ${JSON.stringify(params)}`;
    }
}

// 5. Test Implementation
const myAppRouter = new TypedRouter([
    "/api/v1/user/:userId/profile",
    "/api/v1/posts/:postId/comments/:commentId"
]);

// Valid compilation test
const validResult = myAppRouter.executeHandler(
    "/api/v1/posts/:postId/comments/:commentId",
    { postId: "101", commentId: "202" }
);
console.log(validResult);

// UNCOMMENT THE LINES BELOW TO TEST IF COMPILER CORRECTLY CATCHES ERRORS:
// const invalidResult = myAppRouter.executeHandler(
//     "/api/v1/user/:userId/profile", 
//     { wrongParamName: "404" } // TypeScript should throw an error here
// );
