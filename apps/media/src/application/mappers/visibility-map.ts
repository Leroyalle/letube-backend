import { Visibility } from '@contracts/media/enums/visibility.enum';

type VisibilityType = 'private' | 'public';

export const visibilityMap: Record<VisibilityType, Visibility> = {
  private: Visibility.PRIVATE,
  public: Visibility.PUBLIC,
};
