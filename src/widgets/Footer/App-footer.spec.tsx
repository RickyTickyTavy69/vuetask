import { render } from '@testing-library/vue';
import AppFooter from '@/widgets/Footer/App-footer.vue';

describe('Footer test', () => {



  it('should select the visibility', () => {

    const { getByTestId} = render(AppFooter, {
      props: {
        changeVisibility: jest.fn(),
        visibility: "all",
        items: [],
        removeCompleted: jest.fn(),
      }
    })

   expect(getByTestId("btn-visibility-all")).toHaveClass("selected");
   expect(getByTestId("btn-visibility-active")).not.toHaveClass("selected");

  });

 /* it('should select the visibility', async () => {

    const { getByTestId} = render(AppFooter, {
      props: {
        changeVisibility: jest.fn(),
        visibility: "all",
        items: [],
        removeCompleted: jest.fn(),
      }
    })

    const buttonActive = getByTestId("btn-visibility-active")
    expect(getByTestId("btn-visibility-all")).toHaveClass("selected");

    await user.click(buttonActive);

    expect(getByTestId("btn-visibility-all")).not.toHaveClass("selected");
    expect(getByTestId("btn-visibility-active")).toHaveClass("selected");

  }); */


});
