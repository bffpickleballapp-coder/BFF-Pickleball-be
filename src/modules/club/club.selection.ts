export const OWNER_SELECT = {
  id: true,
  name: true,
  avatarUrl: true,
};

export const CLUB_SELECT = {
  id: true,
  name: true,
  ownerId: true,
  description: true,
  provinceCode: true,
  wardCode: true,
  imageUrl: true,
  totalMembers: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: OWNER_SELECT,
  },
};

export const MEMBERS = {
  status: true,
  joinedAt: true,
};
export const CLUB_LIST_SELECT = {
  id: true,
  name: true,
  imageUrl: true,
  totalMembers: true,
  members: {
    select: MEMBERS,
  },
};
