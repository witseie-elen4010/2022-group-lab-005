'use strict'
const { getUserFriends, getFriendUser, getUserPendingFriends, getUserFriendRequests, addFriend } = require('../src/services/friendsDb.cjs')
// -----------------
// user friend list
test("Get the user's friends where the user sent friend request first", async () => {
  const data = await getUserFriends('winner')
  await expect(data.recordset.length).toBe(1)
})
jest.setTimeout(10000)

test("Get the user's friends where the user sent friend request first, but user does not have friends", async () => {
  const data = await getUserFriends('use')
  await expect(data.recordset.length).toBe(0)
})
jest.setTimeout(10000)

test("Get the user's friends where the friend sent the user friend request first", async () => {
  const data = await getFriendUser('winner')
  await expect(data.recordset.length).toBe(1)
})
jest.setTimeout(10000)

test("Get the user's friends where the user sent friend request first, but user does not have friends", async () => {
  const data = await getFriendUser('use')
  await expect(data.recordset.length).toBe(0)
})
jest.setTimeout(10000)

// -----------------
// user pending friend list
test("Get the user's pending friend request, that are waiting to be accepted, where there is one", async () => {
  const data = await getUserPendingFriends('winner')
  await expect(data.recordset.length).toBe(1)
})
jest.setTimeout(10000)

test("Get the user's pending friend request, that are waiting to be accepted, where there is none", async () => {
  const data = await getUserPendingFriends('use')
  await expect(data.recordset.length).toBe(0)
})
jest.setTimeout(10000)

// -----------------
// incoming friend request that need to be accepted
test("Get the user's incoming friends requests, where there is one", async () => {
  const data = await getUserFriendRequests('winner')
  await expect(data.recordset.length).toBe(1)
})
jest.setTimeout(10000)

test("Get the user's incoming friends request, where there is none", async () => {
  const data = await getUserFriendRequests('use')
  await expect(data.recordset.length).toBe(0)
})
jest.setTimeout(10000)

// -----------------
// add a new friend
test('add a new friend , where friend does not exist', async () => {
  const data = await addFriend('winner', 'use')
  await expect(data).toBe('The friend you trying to add does not exist')
})
jest.setTimeout(10000)

test('add a new friend , where friend is already pending for approval', async () => {
  const data = await addFriend('winner', 'jesse2')
  await expect(data).toBe('The user you are trying to add is pending for approval.')
})
jest.setTimeout(10000)

test('add a new friend , where friend is in your friend list', async () => {
  const data = await addFriend('winner', 'jesse1')
  await expect(data).toBe('The user you are trying to add is already in your friend list')
})
jest.setTimeout(10000)
// insertion and update is not included as it will only work once.

// -----------------
// Same goes for update friend (for decline and accept) , as it will only work once.
