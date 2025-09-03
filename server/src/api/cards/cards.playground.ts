import { prisma } from "../../lib/prismaClient.js";

export default async function cardsPlayground() {
  console.log("user");
  const user = await prisma.user.findFirst();
  console.log(user);
  //8f6b91e3-f04b-45ef-961e-26e00f65b663
  //create board
  //   const board = await prisma.board.create({
  //     data: {
  //       name: "Test Board",
  //       description: "Test Description",
  //       created_by: "8f6b91e3-f04b-45ef-961e-26e00f65b663",
  //     },
  //   });
  //   console.log(board);

  const boardById = await prisma.board.findFirst({
    where: {
      created_by: "8f6b91e3-f04b-45ef-961e-26e00f65b663",
    },
  });
  console.log(boardById);
  //73ac6499-2729-4d2c-8aca-08dd2a2abe7b
  //create list
  //   const list = await prisma.list.create({
  //     data: {
  //       name: "Test List",
  //       boardId: "73ac6499-2729-4d2c-8aca-08dd2a2abe7b",
  //       position: 1000,
  //       is_archived: false,
  //       subscribed: false,
  //     },
  //   });
  //   console.log(list);
  const listById = await prisma.list.findFirst({
    where: {
      id: "d79a1117-271c-460e-852b-f41b1c9132d1",
    },
  });
  console.log(listById);

  //   console.log("add member to list");
  //   const addMemberToList = await prisma.boardMember.create({
  //     data: {
  //       boardId: "73ac6499-2729-4d2c-8aca-08dd2a2abe7b",
  //       userId: "8f6b91e3-f04b-45ef-961e-26e00f65b663",
  //     },
  //   });
  //   console.log(addMemberToList);

  //d79a1117-271c-460e-852b-f41b1c9132d1
  //create card
  //   const card = await prisma.cards.create({
  //     data: {
  //       title: "Test Card",
  //       listId: "d79a1117-271c-460e-852b-f41b1c9132d1",
  //     },
  //   });
  //   console.log(card);

  // const boards = await prisma.board.findMany();
  // console.log(boards);
  //   // console.log("--------------------------------");
  //   const listById = await prisma.list.findFirst({
  //     where: {
  //       id: "f5812b1f-5ed4-403a-b6b6-402c2d7d417b",
  //     },
  //   });
  //   console.log(listById);
  //   console.log("--------------------------------");
  //   const cards = await prisma.cards.findFirst();
  //   console.log(cards);
  //   console.log("--------------------------------");
  //   const newCard = await prisma.cards.create({
  //     data: {
  //       position: 100000001,
  //       title: "Test Card",
  //       list_id: "f5812b1f-5ed4-403a-b6b6-402c2d7d417b", // You need to provide an actual list ID
  //     },
  //   });
  //   console.log(newCard);
}
