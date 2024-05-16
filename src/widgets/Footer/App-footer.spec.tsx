import { fireEvent, render, waitFor } from '@testing-library/vue';
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

  it('should change the visibility when clicked the button', async () => {

    const changeVisibility = jest.fn();

    const { getByTestId} = render(AppFooter, {
      props: {
        changeVisibility,
        visibility: "all",
        items: [],
        removeCompleted: jest.fn(),
      }
    })

    const buttonActive = getByTestId("btn-visibility-active")
    expect(getByTestId("btn-visibility-all")).toHaveClass("selected");

    await fireEvent.click(buttonActive);

    expect(changeVisibility).toHaveBeenCalledWith("active");

  });


});
