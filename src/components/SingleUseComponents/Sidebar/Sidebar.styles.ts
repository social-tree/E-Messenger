import styled from '@emotion/styled'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Container = styled.div`
  padding: 10px 0px;
  min-width: 320px;
  overflow-y: auto;
  border-right: 1px solid #cdd5de;
  box-shadow: 0px 3px 4px rgba(2, 17, 37, 0.04),
    2px 3px 8px rgba(2, 17, 37, 0.04), 6px 3px 16px rgba(2, 17, 37, 0.04);

  ::-webkit-scrollbar {
    width: 3px; /* width of the entire scrollbar */
    display: none;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.grey}; /* color of the tracking area */
  }

  ::-webkit-scrollbar-thumb {
    background-color: blue;
    border-radius: 20px;
    border: 3px solid ${({ theme }) => theme.darkGrey};
  }

  &:hover {
    ::-webkit-scrollbar {
      display: block;
    }
  }
`
