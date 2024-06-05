import type { Meta } from '@storybook/react';
import { IconButton } from '../IconButton/IconButton';
import { ImageListItem } from '../ImageListItem/ImageListItem';
import { ImageListItemBar } from '../ImageListItemBar/ImageListItemBar';
import { ImageList } from './ImageList';

const images = [
  {
    title: 'Mustang',
    url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
  },
  {
    title: 'Porsche',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  },
  {
    title: 'Audi',
    url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f',
  },
  {
    title: 'BMW',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
  },
  {
    title: 'Volkswagen',
    url: 'https://images.unsplash.com/photo-1511125357779-27038c647d9d',
  },
  {
    title: 'Ferrari',
    url: 'https://images.unsplash.com/photo-1606220838315-056192d5e927',
  },
  {
    title: 'Nissan',
    url: 'https://images.unsplash.com/photo-1542228262-3d663b306a53',
  },
];

const Story: Meta<typeof ImageList> = {
  component: ImageList,
  title: 'composites/ImageList',
};
export default Story;

export const Full = {
  args: {
    columns: 3,
  },
  render: (args) => {
    return (
      <ImageList {...args}>
        {images?.map((image) => (
          <ImageListItem>
            <img src={image.url} alt={image.title} />
          </ImageListItem>
        ))}
      </ImageList>
    );
  },
};

export const FullItemBar = {
  args: {
    columns: 3,
  },
  render: (args) => {
    return (
      <ImageList {...args}>
        {images?.map((image) => (
          <ImageListItem>
            <img src={image.url} alt={image.title} />
            <ImageListItemBar title={image.title} alt={image.title} />
          </ImageListItem>
        ))}
      </ImageList>
    );
  },
};

export const FullItemBarPosition = {
  args: {
    columns: 3,
  },
  render: (args) => {
    return (
      <ImageList {...args}>
        {images?.map((image) => (
          <ImageListItem>
            <img src={image.url} alt={image.title} />
            <ImageListItemBar
              title={image.title}
              position="top"
              actionIcon={
                <IconButton
                  icon="Heart"
                  sx={{ color: 'white' }}
                  aria-label={`Favourite ${image.title}`}
                ></IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  },
};

export const Masonry = {
  render: Full.render,
  args: {
    ...Full.args,
    variant: 'masonry',
  },
};
