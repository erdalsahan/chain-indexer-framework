import { ITransformedBlock } from "./transformed_block.js";

export interface IEventTransformer<G, T, E> {
    transform: (value: G) => Promise<ITransformedBlock<T>>
    error: (error: E) => void
}
