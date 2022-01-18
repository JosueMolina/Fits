/* eslint-disable*/

import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity'
  });

  // 3. See if the current item is in their cart
  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
  // 4. if it is, incremement by 1
    console.log(
      `There area already ${existingCartItem.quantity}, in the cart, incerement by 1`
    );

    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  // 5. if it isn't, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId}},
      user: { connect: { id: sesh.itemId}},
    }
  })
}
